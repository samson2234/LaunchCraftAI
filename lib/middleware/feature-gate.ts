import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Plan } from "@prisma/client";

/**
 * Feature limits by plan
 */
export const PLAN_LIMITS = {
    FREE: {
        maxProjects: 1,
        maxLeadsPerProject: 50,
        aiGenerationsPerMonth: 5,
        canAccessPitchDeck: false,
        canAccessBusinessPlan: false,
        canAccessIdeaValidation: false,
        canExportData: false,
    },
    PRO: {
        maxProjects: 5,
        maxLeadsPerProject: 500,
        aiGenerationsPerMonth: 50,
        canAccessPitchDeck: true,
        canAccessBusinessPlan: false,
        canAccessIdeaValidation: true,
        canExportData: true,
    },
    GROWTH: {
        maxProjects: Infinity,
        maxLeadsPerProject: Infinity,
        aiGenerationsPerMonth: Infinity,
        canAccessPitchDeck: true,
        canAccessBusinessPlan: true,
        canAccessIdeaValidation: true,
        canExportData: true,
    },
} as const;

/**
 * Feature gate service
 */
export class FeatureGateService {
    /**
     * Check if user can create a new project
     */
    async canCreateProject(userId: string): Promise<{
        allowed: boolean;
        reason?: string;
        currentCount?: number;
        limit?: number;
    }> {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        if (!subscription) {
            return { allowed: false, reason: "No subscription found" };
        }

        const projectCount = await prisma.project.count({
            where: { userId },
        });

        const limit = PLAN_LIMITS[subscription.plan].maxProjects;

        if (projectCount >= limit) {
            return {
                allowed: false,
                reason: `You've reached your project limit (${limit} projects)`,
                currentCount: projectCount,
                limit,
            };
        }

        return { allowed: true, currentCount: projectCount, limit };
    }

    /**
     * Check if user can access a feature
     */
    async canAccessFeature(
        userId: string,
        feature: keyof Omit<
            (typeof PLAN_LIMITS)[Plan],
            "maxProjects" | "maxLeadsPerProject" | "aiGenerationsPerMonth"
        >
    ): Promise<{ allowed: boolean; reason?: string; plan?: Plan }> {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        if (!subscription) {
            return { allowed: false, reason: "No subscription found" };
        }

        const hasAccess = PLAN_LIMITS[subscription.plan][feature];

        if (!hasAccess) {
            return {
                allowed: false,
                reason: `This feature requires a ${feature === "canAccessBusinessPlan" ? "Growth" : "Pro"} plan or higher`,
                plan: subscription.plan,
            };
        }

        return { allowed: true, plan: subscription.plan };
    }

    /**
     * Check if user can add more leads to a project
     */
    async canAddLead(
        userId: string,
        projectId: string
    ): Promise<{ allowed: boolean; reason?: string; currentCount?: number; limit?: number }> {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        if (!subscription) {
            return { allowed: false, reason: "No subscription found" };
        }

        const leadCount = await prisma.lead.count({
            where: { projectId },
        });

        const limit = PLAN_LIMITS[subscription.plan].maxLeadsPerProject;

        if (leadCount >= limit) {
            return {
                allowed: false,
                reason: `You've reached your lead limit (${limit} leads per project)`,
                currentCount: leadCount,
                limit,
            };
        }

        return { allowed: true, currentCount: leadCount, limit };
    }

    /**
     * Get user's plan limits
     */
    async getUserLimits(userId: string) {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        if (!subscription) {
            return null;
        }

        return {
            plan: subscription.plan,
            limits: PLAN_LIMITS[subscription.plan],
        };
    }

    /**
     * Check if user has active subscription
     */
    async hasActiveSubscription(userId: string): Promise<boolean> {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        return subscription?.status === "ACTIVE";
    }
}

export const featureGateService = new FeatureGateService();

/**
 * Helper function to require authentication
 */
export async function requireAuth() {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    return session;
}

/**
 * Helper function to require specific feature access
 */
export async function requireFeature(
    feature: keyof Omit<
        (typeof PLAN_LIMITS)[Plan],
        "maxProjects" | "maxLeadsPerProject" | "aiGenerationsPerMonth"
    >
) {
    const session = await requireAuth();
    const access = await featureGateService.canAccessFeature(
        session.user.id,
        feature
    );

    if (!access.allowed) {
        throw new Error(access.reason || "Access denied");
    }

    return session;
}
