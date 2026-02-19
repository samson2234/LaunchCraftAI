import { pitchDeckRepository } from "@/lib/repositories/pitch-deck.repository";
import { aiService } from "@/lib/ai/openai.service";
import { featureGateService } from "@/lib/middleware/feature-gate";
import type { CreatePitchDeckInput, UpdatePitchDeckInput, GeneratePitchDeckInput } from "@/lib/validations/feature.schema";

export class PitchDeckService {
    async create(data: CreatePitchDeckInput, userId: string) {
        // Check feature access
        const check = await featureGateService.canAccessFeature(userId, "canAccessPitchDeck");
        if (!check.allowed) {
            throw new Error(check.reason || "Pitch Deck generation is not available on your plan");
        }

        return await pitchDeckRepository.create({
            title: data.title,
            slides: data.slides || [],
            project: {
                connect: { id: data.projectId },
            },
        });
    }

    async generateWithAI(data: GeneratePitchDeckInput, userId: string) {
        // Generate slides using AI
        const aiContent = await aiService.generatePitchDeck({
            projectName: data.projectName,
            description: data.description,
        });

        if (!aiContent) {
            throw new Error("Failed to generate pitch deck");
        }

        // Check if pitch deck already exists
        const existing = await pitchDeckRepository.findByProjectId(data.projectId);

        if (existing) {
            return await pitchDeckRepository.update(existing.id, {
                title: `${data.projectName} Pitch Deck`,
                slides: aiContent.slides || aiContent,
            });
        }

        // Create new pitch deck
        return await this.create(
            {
                projectId: data.projectId,
                title: `${data.projectName} Pitch Deck`,
                slides: aiContent.slides || aiContent,
            },
            userId
        );
    }

    async findById(id: string, userId: string) {
        const pitchDeck = await pitchDeckRepository.findById(id);
        if (!pitchDeck || pitchDeck.project.userId !== userId) {
            throw new Error("Pitch deck not found");
        }
        return pitchDeck;
    }

    async findByProjectId(projectId: string, userId: string) {
        const pitchDeck = await pitchDeckRepository.findByProjectId(projectId);
        if (pitchDeck && pitchDeck.project.userId !== userId) {
            throw new Error("Unauthorized");
        }
        return pitchDeck;
    }

    async update(id: string, data: UpdatePitchDeckInput, userId: string) {
        await this.findById(id, userId);
        return await pitchDeckRepository.update(id, data);
    }

    async delete(id: string, userId: string) {
        await this.findById(id, userId);
        return await pitchDeckRepository.delete(id);
    }
}

export const pitchDeckService = new PitchDeckService();
