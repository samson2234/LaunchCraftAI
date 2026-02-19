import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export class LeadRepository {
    async create(data: Prisma.LeadCreateInput) {
        return await prisma.lead.create({ data });
    }

    async findById(id: string) {
        return await prisma.lead.findUnique({
            where: { id },
            include: { project: true },
        });
    }

    async findByProjectId(projectId: string) {
        return await prisma.lead.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findByEmail(email: string, projectId: string) {
        return await prisma.lead.findFirst({
            where: { email, projectId },
        });
    }

    async update(id: string, data: Prisma.LeadUpdateInput) {
        return await prisma.lead.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return await prisma.lead.delete({
            where: { id },
        });
    }

    async count(projectId: string) {
        return await prisma.lead.count({
            where: { projectId },
        });
    }
}

export const leadRepository = new LeadRepository();
