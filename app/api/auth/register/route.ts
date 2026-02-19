import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth.schema";
import { userService } from "@/lib/services/user.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input
        const validatedData = registerSchema.parse(body);

        // Register user
        const user = await userService.register(validatedData);

        return NextResponse.json(
            { user, message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
