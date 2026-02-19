import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validations/auth.schema";
import { userService } from "@/lib/services/user.service";

export const authConfig = {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials);

                if (!validatedFields.success) {
                    return null;
                }

                const { email, password } = validatedFields.data;
                const user = await userService.verifyPassword(email, password);

                if (!user) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");

            if (isOnDashboard || isOnAdmin) {
                if (isLoggedIn) {
                    // Check admin access
                    if (isOnAdmin && auth.user.role !== "ADMIN") {
                        return Response.redirect(new URL("/dashboard", nextUrl));
                    }
                    return true;
                }
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // Redirect logged-in users trying to access auth pages
                if (nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
            }

            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "USER" | "ADMIN";
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
