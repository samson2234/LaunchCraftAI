import { prisma } from "@/lib/db";
import { Plan, SubscriptionStatus } from "@prisma/client";

export interface UpdateSubscriptionData {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    plan?: Plan;
    status?: SubscriptionStatus;
    currentPeriodEnd?: Date;
}

export class SubscriptionRepository {
    async findByUserId(userId: string) {
        return prisma.subscription.findUnique({
            where: { userId },
            include: { user: true },
        });
    }

    async findByStripeCustomerId(stripeCustomerId: string) {
        return prisma.subscription.findUnique({
            where: { stripeCustomerId },
        });
    }

    async findByStripeSubscriptionId(stripeSubscriptionId: string) {
        return prisma.subscription.findUnique({
            where: { stripeSubscriptionId },
        });
    }

    async update(id: string, data: UpdateSubscriptionData) {
        return prisma.subscription.update({
            where: { id },
            data,
        });
    }
}

export const subscriptionRepository = new SubscriptionRepository();
