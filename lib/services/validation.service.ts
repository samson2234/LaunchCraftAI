import { validationEntryRepository } from "@/lib/repositories/validation-entry.repository";
import { aiService } from "@/lib/ai/openai.service";
import { featureGateService } from "@/lib/middleware/feature-gate";
import type { CreateValidationEntryInput, UpdateValidationEntryInput, ValidateIdeaInput } from "@/lib/validations/feature.schema";

export class ValidationService {
    async create(data: CreateValidationEntryInput, userId: string) {
        // Check feature access
        const check = await featureGateService.canAccessFeature(userId, "canAccessIdeaValidation");
        if (!check.allowed) {
            throw new Error(check.reason || "Idea Validation is not available on your plan");
        }

        return await validationEntryRepository.create({
            question: data.question,
            answer: data.answer,
            score: data.score,
            notes: data.notes,
            project: {
                connect: { id: data.projectId },
            },
        });
    }

    async validateWithAI(data: ValidateIdeaInput, userId: string) {
        // Use AI to validate the idea
        const validation = await aiService.validateIdea({
            idea: data.idea,
            targetMarket: data.targetMarket,
        });

        if (!validation) {
            throw new Error("Failed to validate idea");
        }

        return validation;
    }

    async findById(id: string, userId: string) {
        const entry = await validationEntryRepository.findById(id);
        if (!entry || entry.project.userId !== userId) {
            throw new Error("Validation entry not found");
        }
        return entry;
    }

    async findByProjectId(projectId: string, userId: string) {
        return await validationEntryRepository.findByProjectId(projectId);
    }

    async update(id: string, data: UpdateValidationEntryInput, userId: string) {
        await this.findById(id, userId);
        return await validationEntryRepository.update(id, data);
    }

    async delete(id: string, userId: string) {
        await this.findById(id, userId);
        return await validationEntryRepository.delete(id);
    }

    async getAverageScore(projectId: string, userId: string) {
        return await validationEntryRepository.getAverageScore(projectId);
    }
}

export const validationService = new ValidationService();
