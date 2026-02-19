import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { projectService } from "@/lib/services/project.service";
import { createProjectSchema } from "@/lib/validations/project.schema";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const projects = await projectService.getUserProjects(session.user.id);

        return NextResponse.json({ projects });
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

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validatedData = createProjectSchema.parse(body);

        const project = await projectService.createProject({
            userId: session.user.id,
            ...validatedData,
        });

        return NextResponse.json(
            { project, message: "Project created successfully" },
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
