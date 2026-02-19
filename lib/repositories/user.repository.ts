import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export interface CreateUserData {
    email: string;
    name?: string;
    password: string;
    role?: UserRole;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
    image?: string;
    emailVerified?: Date;
}

export class UserRepository {
    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                subscription: true,
                projects: true,
            },
        });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            include: {
                subscription: true,
            },
        });
    }

    async create(data: CreateUserData) {
        return prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
                role: data.role || UserRole.USER,
                subscription: {
                    create: {
                        plan: "FREE",
                        status: "ACTIVE",
                    },
                },
            },
            include: {
                subscription: true,
            },
        });
    }

    async update(id: string, data: UpdateUserData) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return prisma.user.delete({
            where: { id },
        });
    }

    async list() {
        return prisma.user.findMany({
            include: {
                subscription: true,
                _count: {
                    select: { projects: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}

export const userRepository = new UserRepository();
