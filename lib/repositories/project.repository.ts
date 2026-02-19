import { prisma } from "@/lib/db";

export interface CreateProjectData {
    userId: string;
    name: string;
    description?: string;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
}

export class ProjectRepository {
    async findById(id: string) {
        return prisma.project.findUnique({
            where: { id },
            include: {
                landingPage: true,
                pitchDeck: true,
                businessPlan: true,
                leads: true,
                validationEntries: true,
            },
        });
    }

    async findByUserId(userId: string) {
        return prisma.project.findMany({
            where: { userId },
            include: {
                landingPage: true,
                pitchDeck: true,
                businessPlan: true,
                _count: {
                    select: {
                        leads: true,
                        validationEntries: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
    }

    async countByUserId(userId: string) {
        return prisma.project.count({
            where: { userId },
        });
    }

    async create(data: CreateProjectData) {
        return prisma.project.create({
            data,
            include: {
                landingPage: true,
                pitchDeck: true,
                businessPlan: true,
            },
        });
    }

    async update(id: string, data: UpdateProjectData) {
        return prisma.project.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return prisma.project.delete({
            where: { id },
        });
    }
}

export const projectRepository = new ProjectRepository();
