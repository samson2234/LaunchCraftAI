import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export class PitchDeckRepository {
    async create(data: Prisma.PitchDeckCreateInput) {
        return await prisma.pitchDeck.create({ data });
    }

    async findById(id: string) {
        return await prisma.pitchDeck.findUnique({
            where: { id },
            include: { project: true },
        });
    }

    async findByProjectId(projectId: string) {
        return await prisma.pitchDeck.findUnique({
            where: { projectId },
            include: { project: true },
        });
    }

    async update(id: string, data: Prisma.PitchDeckUpdateInput) {
        return await prisma.pitchDeck.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return await prisma.pitchDeck.delete({
            where: { id },
        });
    }
}

export const pitchDeckRepository = new PitchDeckRepository();
