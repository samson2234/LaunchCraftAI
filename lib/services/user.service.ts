import { hash, compare } from "bcryptjs";
import { userRepository, CreateUserData } from "@/lib/repositories/user.repository";

export class UserService {
    async register(data: { email: string; name?: string; password: string }) {
        // Check if user already exists
        const existing = await userRepository.findByEmail(data.email);
        if (existing) {
            throw new Error("User with this email already exists");
        }

        // Hash password
        const hashedPassword = await hash(data.password, 10);

        // Create user
        const user = await userRepository.create({
            email: data.email,
            name: data.name,
            password: hashedPassword,
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async verifyPassword(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return null;
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
            return null;
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getUserById(id: string) {
        const user = await userRepository.findById(id);
        if (!user) {
            return null;
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getUserByEmail(email: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return null;
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateUser(id: string, data: { name?: string; image?: string }) {
        const user = await userRepository.update(id, data);
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async deleteUser(id: string) {
        return userRepository.delete(id);
    }

    async listUsers() {
        const users = await userRepository.list();
        return users.map(({ password: _, ...user }) => user);
    }
}

export const userService = new UserService();
