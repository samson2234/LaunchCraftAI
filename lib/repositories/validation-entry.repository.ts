import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export class ValidationEntryRepository {
    async create(data: Prisma.ValidationEntryCreateInput) {
        return await prisma.validationEntry.create({ data });
    }

    async findById(id: string) {
        return await prisma.validationEntry.findUnique({
            where: { id },
            include: { project: true },
        });
    }

    async findByProjectId(projectId: string) {
        return await prisma.validationEntry.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" },
        });
    }

    async update(id: string, data: Prisma.ValidationEntryUpdateInput) {
        return await prisma.validationEntry.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return await prisma.validationEntry.delete({
            where: { id },
        });
    }

    async getAverageScore(projectId: string) {
        const result = await prisma.validationEntry.aggregate({
            where: { projectId },
            _avg: { score: true },
        });
        return result._avg.score || 0;
    }
}

export const validationEntryRepository = new ValidationEntryRepository();
