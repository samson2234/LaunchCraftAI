'use server'

import { userService } from "@/lib/services/user.service";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { registerSchema, loginSchema } from "@/lib/validations/auth.schema";

export async function registerUser(prevState: any, formData: FormData) {
    try {
        const rawData = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
        };

        const validatedData = registerSchema.parse(rawData);

        await userService.register({
            name: validatedData.name,
            email: validatedData.email,
            password: validatedData.password,
        });

        // Automatically sign in after registration
        await signIn("credentials", {
            email: validatedData.email,
            password: validatedData.password,
            redirectTo: "/dashboard",
        });

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        if (error instanceof AuthError) {
            return { error: error.message };
        }
        return {
            error: error instanceof Error ? error.message : "Something went wrong"
        };
    }
}

export async function loginUser(prevState: any, formData: FormData) {
    try {
        const rawData = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        // basic validation before attempting sign in
        const validatedData = loginSchema.parse(rawData);

        await signIn("credentials", {
            email: validatedData.email,
            password: validatedData.password,
            redirectTo: "/dashboard",
        });
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials." };
                default:
                    return { error: "Something went wrong." };
            }
        }
        throw error;
    }
}
