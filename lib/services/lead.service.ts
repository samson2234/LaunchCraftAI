import { leadRepository } from "@/lib/repositories/lead.repository";
import { featureGateService } from "@/lib/middleware/feature-gate";
import type { CreateLeadInput, UpdateLeadInput } from "@/lib/validations/feature.schema";

export class LeadService {
    async create(data: CreateLeadInput, userId: string) {
        // Check lead limits for this project
        const check = await featureGateService.canAddLead(userId, data.projectId);
        if (!check.allowed) {
            throw new Error(check.reason || "Lead limit reached for this project");
        }

        // Check if lead with email already exists for this project
        const existing = await leadRepository.findByEmail(data.email, data.projectId);
        if (existing) {
            throw new Error("A lead with this email already exists for this project");
        }

        return await leadRepository.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            status: data.status || "NEW",
            notes: data.notes,
            project: {
                connect: { id: data.projectId },
            },
        });
    }

    async findById(id: string, userId: string) {
        const lead = await leadRepository.findById(id);
        if (!lead || lead.project.userId !== userId) {
            throw new Error("Lead not found");
        }
        return lead;
    }

    async findByProjectId(projectId: string, userId: string) {
        return await leadRepository.findByProjectId(projectId);
    }

    async update(id: string, data: UpdateLeadInput, userId: string) {
        await this.findById(id, userId);
        return await leadRepository.update(id, data);
    }

    async delete(id: string, userId: string) {
        await this.findById(id, userId);
        return await leadRepository.delete(id);
    }

    async count(projectId: string) {
        return await leadRepository.count(projectId);
    }
}

export const leadService = new LeadService();
