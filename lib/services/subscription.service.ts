import { subscriptionRepository } from "@/lib/repositories/subscription.repository";
import { stripeService } from "@/lib/stripe/stripe.service";
import type { Plan } from "@prisma/client";

export class SubscriptionService {
    async createCheckoutSession(params: {
        userId: string;
        plan: "PRO" | "GROWTH";
        successUrl: string;
        cancelUrl: string;
    }) {
        // Get user's subscription
        const subscription = await subscriptionRepository.findByUserId(params.userId);
        if (!subscription) {
            throw new Error("Subscription not found");
        }

        // Get or create Stripe customer
        let customerId = subscription.stripeCustomerId;
        if (!customerId) {
            const user = await subscriptionRepository.findByUserId(params.userId);
            if (!user) throw new Error("User not found");

            const customer = await stripeService.createCustomer({
                email: user.user.email,
                name: user.user.name || undefined,
            });

            customerId = customer.id;

            // Update subscription with customer ID
            await subscriptionRepository.update(subscription.id, {
                stripeCustomerId: customerId,
            });
        }

        // Get price ID for the plan
        const priceId =
            params.plan === "PRO"
                ? process.env.STRIPE_PRO_PRICE_ID
                : process.env.STRIPE_GROWTH_PRICE_ID;

        if (!priceId) {
            throw new Error(`Price ID not configured for ${params.plan} plan`);
        }

        // Create checkout session
        const session = await stripeService.createCheckoutSession({
            customerId,
            priceId,
            successUrl: params.successUrl,
            cancelUrl: params.cancelUrl,
            userId: params.userId,
        });

        return session;
    }

    async createBillingPortalSession(params: {
        userId: string;
        returnUrl: string;
    }) {
        const subscription = await subscriptionRepository.findByUserId(params.userId);
        if (!subscription?.stripeCustomerId) {
            throw new Error("No Stripe customer found");
        }

        return await stripeService.createBillingPortalSession({
            customerId: subscription.stripeCustomerId,
            returnUrl: params.returnUrl,
        });
    }

    async handleWebhookEvent(event: any) {
        switch (event.type) {
            case "checkout.session.completed":
                await this.handleCheckoutCompleted(event.data.object);
                break;
            case "customer.subscription.updated":
                await this.handleSubscriptionUpdated(event.data.object);
                break;
            case "customer.subscription.deleted":
                await this.handleSubscriptionDeleted(event.data.object);
                break;
        }
    }

    private async handleCheckoutCompleted(session: any) {
        const userId = session.metadata.userId;
        const subscriptionId = session.subscription;

        const stripeSubscription = await stripeService.getSubscription(subscriptionId);

        // Determine plan from price ID
        let plan: Plan = "FREE";
        if (stripeSubscription.items.data[0].price.id === process.env.STRIPE_PRO_PRICE_ID) {
            plan = "PRO";
        } else if (stripeSubscription.items.data[0].price.id === process.env.STRIPE_GROWTH_PRICE_ID) {
            plan = "GROWTH";
        }

        // Update subscription
        const subscription = await subscriptionRepository.findByUserId(userId);
        if (subscription) {
            await subscriptionRepository.update(subscription.id, {
                stripeSubscriptionId: subscriptionId,
                stripePriceId: stripeSubscription.items.data[0].price.id,
                plan,
                status: "ACTIVE",
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            });
        }
    }

    private async handleSubscriptionUpdated(stripeSubscription: any) {
        const subscription = await subscriptionRepository.findByStripeSubscriptionId(
            stripeSubscription.id
        );

        if (subscription) {
            await subscriptionRepository.update(subscription.id, {
                status: stripeSubscription.status === "active" ? "ACTIVE" : "CANCELED",
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            });
        }
    }

    private async handleSubscriptionDeleted(stripeSubscription: any) {
        const subscription = await subscriptionRepository.findByStripeSubscriptionId(
            stripeSubscription.id
        );

        if (subscription) {
            await subscriptionRepository.update(subscription.id, {
                plan: "FREE",
                status: "CANCELED",
                stripeSubscriptionId: null,
                stripePriceId: null,
                currentPeriodEnd: null,
            });
        }
    }
}

export const subscriptionService = new SubscriptionService();
