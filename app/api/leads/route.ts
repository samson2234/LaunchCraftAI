import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { leadService } from "@/lib/services/lead.service";
import { createLeadSchema } from "@/lib/validations/feature.schema";
import { featureGateService } from "@/lib/middleware/feature-gate";

export async function POST(req: Request) {
    try {
        // Lead creation can happen without auth (from a public landing page)
        const data = await req.json();
        const validatedData = createLeadSchema.parse(data);

        // We need to find the project's owner to check their subscription limits
        const { projectRepository } = await import("@/lib/repositories/project.repository");
        const project = await projectRepository.findById(validatedData.projectId);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const lead = await leadService.create(validatedData, project.userId);
        return NextResponse.json(lead, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        const leads = await leadService.findByProjectId(projectId, session.user.id);
        return NextResponse.json(leads);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
