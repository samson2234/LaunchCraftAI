import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { landingPageService } from "@/lib/services/landing-page.service";
import { createLandingPageSchema } from "@/lib/validations/feature.schema";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const validatedData = createLandingPageSchema.parse(data);

        const landingPage = await landingPageService.create(validatedData, session.user.id);
        return NextResponse.json(landingPage, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
