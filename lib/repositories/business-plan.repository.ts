import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export class BusinessPlanRepository {
    async create(data: Prisma.BusinessPlanCreateInput) {
        return await prisma.businessPlan.create({ data });
    }

    async findById(id: string) {
        return await prisma.businessPlan.findUnique({
            where: { id },
            include: { project: true },
        });
    }

    async findByProjectId(projectId: string) {
        return await prisma.businessPlan.findUnique({
            where: { projectId },
            include: { project: true },
        });
    }

    async update(id: string, data: Prisma.BusinessPlanUpdateInput) {
        return await prisma.businessPlan.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return await prisma.businessPlan.delete({
            where: { id },
        });
    }
}

export const businessPlanRepository = new BusinessPlanRepository();
