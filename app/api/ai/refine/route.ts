import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiService } from "@/lib/ai/openai.service";
import { landingPageService } from "@/lib/services/landing-page.service";
import { pitchDeckService } from "@/lib/services/pitch-deck.service";
import { businessPlanService } from "@/lib/services/business-plan.service";
import { rateLimit, RateLimitResponse } from "@/lib/middleware/rate-limit";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { landingPageId, pitchDeckId, businessPlanId, instruction } = await req.json();

        if (!instruction) {
            return NextResponse.json({ error: "Instruction is required" }, { status: 400 });
        }

        // Rate limit: 10 refinements per 10 minutes
        const limiter = await rateLimit(`ai-refine-${userId}`, 10, 10 * 60 * 1000);
        if (!limiter.success) {
            return RateLimitResponse(limiter.limit, limiter.reset);
        }

        // Handle Landing Page Refinement
        if (landingPageId) {
            const landingPage = await landingPageService.findById(landingPageId, userId);
            const refined = await aiService.refineLandingPage({
                projectName: landingPage.project.name,
                currentContent: landingPage.content,
                instruction,
            });

            if (!refined) throw new Error("Failed to refine landing page");

            const updated = await landingPageService.update(landingPageId, {
                title: refined.headline,
                subtitle: refined.subheadline,
                content: refined,
            }, userId);
            return NextResponse.json(updated);
        }

        // Handle Pitch Deck Refinement
        if (pitchDeckId) {
            const pitchDeck = await pitchDeckService.findById(pitchDeckId, userId);
            const refined = await aiService.refinePitchDeck({
                projectName: pitchDeck.project.name,
                currentContent: pitchDeck.slides,
                instruction,
            });

            if (!refined) throw new Error("Failed to refine pitch deck");

            const updated = await pitchDeckService.update(pitchDeckId, {
                slides: refined.slides || refined,
            }, userId);
            return NextResponse.json(updated);
        }

        // Handle Business Plan Refinement
        if (businessPlanId) {
            const businessPlan = await businessPlanService.findById(businessPlanId, userId);
            const refined = await aiService.refineBusinessPlan({
                projectName: businessPlan.project.name,
                currentContent: businessPlan.content,
                instruction,
            });

            if (!refined) throw new Error("Failed to refine business plan");

            const updated = await businessPlanService.update(businessPlanId, {
                executiveSummary: refined.executiveSummary,
                marketAnalysis: refined.marketAnalysis,
                financialPlan: refined.financialPlan,
                strategy: refined.strategy,
                content: refined,
            }, userId);
            return NextResponse.json(updated);
        }

        return NextResponse.json({ error: "No asset ID provided" }, { status: 400 });
    } catch (error) {
        console.error("Refinement Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to refine content" },
            { status: 500 }
        );
    }
}
