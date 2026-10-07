import Stripe from "stripe";

let client: Stripe | undefined;

/**
 * Created on first use so a missing key fails the request, not the build.
 */
function getStripe(): Stripe {
    if (!client) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("Missing STRIPE_SECRET_KEY environment variable");
        }
        client = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2025-02-24.acacia",
            typescript: true,
        });
    }
    return client;
}

/**
 * Stripe Service for payment processing
 */
export class StripeService {
    /**
     * Create a Stripe customer
     */
    async createCustomer(params: { email: string; name?: string }) {
        return await getStripe().customers.create({
            email: params.email,
            name: params.name,
            metadata: {
                createdAt: new Date().toISOString(),
            },
        });
    }

    /**
     * Create a checkout session for subscription
     */
    async createCheckoutSession(params: {
        customerId: string;
        priceId: string;
        successUrl: string;
        cancelUrl: string;
        userId: string;
    }) {
        return await getStripe().checkout.sessions.create({
            customer: params.customerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: params.priceId,
                    quantity: 1,
                },
            ],
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            metadata: {
                userId: params.userId,
            },
        });
    }

    /**
     * Create a billing portal session
     */
    async createBillingPortalSession(params: {
        customerId: string;
        returnUrl: string;
    }) {
        return await getStripe().billingPortal.sessions.create({
            customer: params.customerId,
            return_url: params.returnUrl,
        });
    }

    /**
     * Get subscription details
     */
    async getSubscription(subscriptionId: string) {
        return await getStripe().subscriptions.retrieve(subscriptionId);
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(subscriptionId: string) {
        return await getStripe().subscriptions.cancel(subscriptionId);
    }

    /**
     * Update subscription
     */
    async updateSubscription(params: {
        subscriptionId: string;
        priceId: string;
    }) {
        const subscription = await getStripe().subscriptions.retrieve(
            params.subscriptionId
        );

        return await getStripe().subscriptions.update(params.subscriptionId, {
            items: [
                {
                    id: subscription.items.data[0].id,
                    price: params.priceId,
                },
            ],
            proration_behavior: "create_prorations",
        });
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload: string | Buffer, signature: string) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
        }

        return getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
    }
}

export const stripeService = new StripeService();

/**
 * Stripe pricing configuration
 */
export const STRIPE_PLANS = {
    FREE: {
        name: "Free",
        priceId: null,
        price: 0,
        features: [
            "1 project",
            "Basic landing page",
            "Email support",
        ],
    },
    PRO: {
        name: "Pro",
        priceId: process.env.STRIPE_PRO_PRICE_ID || "",
        price: 29,
        features: [
            "5 projects",
            "AI landing pages",
            "Pitch deck generator",
            "Lead capture",
            "Priority support",
        ],
    },
    GROWTH: {
        name: "Growth",
        priceId: process.env.STRIPE_GROWTH_PRICE_ID || "",
        price: 99,
        features: [
            "Unlimited projects",
            "All Pro features",
            "Business plan generator",
            "Idea validation",
            "Custom branding",
            "API access",
            "Dedicated support",
        ],
    },
} as const;

export type StripePlan = keyof typeof STRIPE_PLANS;
