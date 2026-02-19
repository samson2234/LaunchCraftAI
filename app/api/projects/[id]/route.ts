import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { projectService } from "@/lib/services/project.service";
import { updateProjectSchema } from "@/lib/validations/project.schema";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const project = await projectService.getProjectById(id, session.user.id);
        return NextResponse.json({ project });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Project not found" },
            { status: 404 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = updateProjectSchema.parse(body);

        const project = await projectService.updateProject(
            id,
            session.user.id,
            validatedData
        );

        return NextResponse.json({ project, message: "Project updated successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update project" },
            { status: 400 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await projectService.deleteProject(id, session.user.id);
        return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to delete project" },
            { status: 400 }
        );
    }
}
