import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { landingPageService } from "@/lib/services/landing-page.service";
import { pitchDeckService } from "@/lib/services/pitch-deck.service";
import { businessPlanService } from "@/lib/services/business-plan.service";
import { validationService } from "@/lib/services/validation.service";
import {
    generateLandingPageSchema,
    generatePitchDeckSchema,
    generateBusinessPlanSchema,
    validateIdeaSchema
} from "@/lib/validations/feature.schema";
import { featureGateService } from "@/lib/middleware/feature-gate";
import { rateLimit, RateLimitResponse } from "@/lib/middleware/rate-limit";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Apply rate limiting: 5 requests per 10 minutes for AI generation
        const limiter = await rateLimit(`ai-gen-${userId}`, 5, 10 * 60 * 1000);
        if (!limiter.success) {
            return RateLimitResponse(limiter.limit, limiter.reset);
        }

        const { type, data } = await req.json();
        const projectId = data?.projectId;

        let enrichedData = { ...data };

        if (projectId) {
            // Enrich data from database
            const { projectService } = await import("@/lib/services/project.service");
            const project = await projectService.getProjectById(projectId, userId);

            enrichedData = {
                ...data,
                projectName: project.name,
                description: project.description || "A new startup project",
            };
        }

        // Check if user has AI generation capacity remaining (feature gating)
        const access = await featureGateService.getUserLimits(userId);
        if (!access) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        // Handle different generation types
        switch (type) {
            case "LANDING_PAGE": {
                const validatedData = generateLandingPageSchema.parse(enrichedData);
                const result = await landingPageService.generateWithAI(validatedData, userId);
                return NextResponse.json(result);
            }
            case "PITCH_DECK": {
                const accessCheck = await featureGateService.canAccessFeature(userId, "canAccessPitchDeck");
                if (!accessCheck.allowed) {
                    return NextResponse.json({ error: accessCheck.reason || "Upgrade to Pro to access Pitch Deck generation" }, { status: 403 });
                }
                const validatedData = generatePitchDeckSchema.parse(enrichedData);
                const result = await pitchDeckService.generateWithAI(validatedData, userId);
                return NextResponse.json(result);
            }
            case "BUSINESS_PLAN": {
                const accessCheck = await featureGateService.canAccessFeature(userId, "canAccessBusinessPlan");
                if (!accessCheck.allowed) {
                    return NextResponse.json({ error: accessCheck.reason || "Upgrade to Growth to access Business Plan generation" }, { status: 403 });
                }
                const validatedData = generateBusinessPlanSchema.parse(enrichedData);
                const result = await businessPlanService.generateWithAI(validatedData, userId);
                return NextResponse.json(result);
            }

            case "IDEA_VALIDATION": {
                const validatedData = validateIdeaSchema.parse(data);
                const result = await validationService.validateWithAI(validatedData, userId);
                return NextResponse.json(result);
            }
            default:
                return NextResponse.json({ error: "Invalid generation type" }, { status: 400 });
        }
    } catch (error) {
        console.error("AI Generation Error:", error);
        if (error instanceof Error) {
            // Check for Zod validation errors
            if (error.name === "ZodError") {
                return NextResponse.json({ error: "Invalid input data", details: (error as any).errors }, { status: 400 });
            }
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
    }
}
