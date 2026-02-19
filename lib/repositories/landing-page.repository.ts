import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export class LandingPageRepository {
    async create(data: Prisma.LandingPageCreateInput) {
        return await prisma.landingPage.create({ data });
    }

    async findById(id: string) {
        return await prisma.landingPage.findUnique({
            where: { id },
            include: { project: true },
        });
    }

    async findByProjectId(projectId: string) {
        return await prisma.landingPage.findUnique({
            where: { projectId },
            include: { project: true },
        });
    }

    async update(id: string, data: Prisma.LandingPageUpdateInput) {
        return await prisma.landingPage.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return await prisma.landingPage.delete({
            where: { id },
        });
    }
}

export const landingPageRepository = new LandingPageRepository();
