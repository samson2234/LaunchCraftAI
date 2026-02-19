import { landingPageRepository } from "@/lib/repositories/landing-page.repository";
import { aiService } from "@/lib/ai/openai.service";
import type { CreateLandingPageInput, UpdateLandingPageInput, GenerateLandingPageInput } from "@/lib/validations/feature.schema";

export class LandingPageService {
    async create(data: CreateLandingPageInput, userId: string) {
        // Verify project ownership
        const project = await landingPageRepository.findByProjectId(data.projectId);
        if (project && project.project.userId !== userId) {
            throw new Error("Unauthorized");
        }

        return await landingPageRepository.create({
            title: data.title,
            subtitle: data.subtitle,
            content: data.content || {},
            project: {
                connect: { id: data.projectId },
            },
        });
    }

    async generateWithAI(data: GenerateLandingPageInput, userId: string) {
        // Generate content using AI
        const aiContent = await aiService.generateLandingPage({
            projectName: data.projectName,
            description: data.description,
            targetAudience: data.targetAudience,
        });

        if (!aiContent) {
            throw new Error("Failed to generate landing page content");
        }

        // Check if landing page already exists
        const existing = await landingPageRepository.findByProjectId(data.projectId);

        if (existing) {
            return await landingPageRepository.update(existing.id, {
                title: aiContent.headline,
                subtitle: aiContent.subheadline,
                content: aiContent,
            });
        }

        // Create new landing page
        return await this.create(
            {
                projectId: data.projectId,
                title: aiContent.headline,
                subtitle: aiContent.subheadline,
                content: aiContent,
            },
            userId
        );
    }

    async findById(id: string, userId: string) {
        const landingPage = await landingPageRepository.findById(id);
        if (!landingPage || landingPage.project.userId !== userId) {
            throw new Error("Landing page not found");
        }
        return landingPage;
    }

    async findByProjectId(projectId: string, userId: string) {
        const landingPage = await landingPageRepository.findByProjectId(projectId);
        if (landingPage && landingPage.project.userId !== userId) {
            throw new Error("Unauthorized");
        }
        return landingPage;
    }

    async update(id: string, data: UpdateLandingPageInput, userId: string) {
        // Verify ownership
        await this.findById(id, userId);

        return await landingPageRepository.update(id, data);
    }

    async delete(id: string, userId: string) {
        // Verify ownership
        await this.findById(id, userId);

        return await landingPageRepository.delete(id);
    }
}

export const landingPageService = new LandingPageService();
