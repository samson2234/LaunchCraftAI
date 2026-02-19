import { businessPlanRepository } from "@/lib/repositories/business-plan.repository";
import { aiService } from "@/lib/ai/openai.service";
import { featureGateService } from "@/lib/middleware/feature-gate";
import type { CreateBusinessPlanInput, UpdateBusinessPlanInput, GenerateBusinessPlanInput } from "@/lib/validations/feature.schema";

export class BusinessPlanService {
    async create(data: CreateBusinessPlanInput, userId: string) {
        // Check feature access
        const check = await featureGateService.canAccessFeature(userId, "canAccessBusinessPlan");
        if (!check.allowed) {
            throw new Error(check.reason || "Business Plan generation is not available on your plan");
        }

        return await businessPlanRepository.create({
            executiveSummary: data.executiveSummary,
            marketAnalysis: data.marketAnalysis || {},
            financialPlan: data.financialPlan || {},
            strategy: data.strategy || {},
            content: data.content || {},
            project: {
                connect: { id: data.projectId },
            },
        });
    }

    async generateWithAI(data: GenerateBusinessPlanInput, userId: string) {
        // Generate business plan using AI
        const aiContent = await aiService.generateBusinessPlan({
            projectName: data.projectName,
            description: data.description,
        });

        if (!aiContent) {
            throw new Error("Failed to generate business plan");
        }

        // Check if business plan already exists
        const existing = await businessPlanRepository.findByProjectId(data.projectId);

        if (existing) {
            return await businessPlanRepository.update(existing.id, {
                executiveSummary: aiContent.executiveSummary,
                marketAnalysis: aiContent.marketAnalysis,
                financialPlan: aiContent.financialPlan,
                strategy: aiContent.strategy,
                content: aiContent,
            });
        }

        // Create new business plan
        return await this.create(
            {
                projectId: data.projectId,
                executiveSummary: aiContent.executiveSummary,
                marketAnalysis: aiContent.marketAnalysis,
                financialPlan: aiContent.financialPlan,
                strategy: aiContent.strategy,
                content: aiContent,
            },
            userId
        );
    }

    async findById(id: string, userId: string) {
        const businessPlan = await businessPlanRepository.findById(id);
        if (!businessPlan || businessPlan.project.userId !== userId) {
            throw new Error("Business plan not found");
        }
        return businessPlan;
    }

    async findByProjectId(projectId: string, userId: string) {
        const businessPlan = await businessPlanRepository.findByProjectId(projectId);
        if (businessPlan && businessPlan.project.userId !== userId) {
            throw new Error("Unauthorized");
        }
        return businessPlan;
    }

    async update(id: string, data: UpdateBusinessPlanInput, userId: string) {
        await this.findById(id, userId);
        return await businessPlanRepository.update(id, data);
    }

    async delete(id: string, userId: string) {
        await this.findById(id, userId);
        return await businessPlanRepository.delete(id);
    }
}

export const businessPlanService = new BusinessPlanService();
