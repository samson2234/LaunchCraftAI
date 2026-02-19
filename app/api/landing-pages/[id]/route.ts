import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { landingPageService } from "@/lib/services/landing-page.service";
import { updateLandingPageSchema } from "@/lib/validations/feature.schema";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();

        // Remove projectId if it's passed in from the editor's body
        // as we use the ID from the URL for updates
        const { projectId, ...updateData } = data;

        const validatedData = updateLandingPageSchema.parse(updateData);

        const landingPage = await landingPageService.update(id, validatedData, session.user.id);
        return NextResponse.json(landingPage);
    } catch (error: any) {
        console.error("Landing Page Update Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 400 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const landingPage = await landingPageService.findById(id, session.user.id);
        return NextResponse.json(landingPage);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 400 });
    }
}
