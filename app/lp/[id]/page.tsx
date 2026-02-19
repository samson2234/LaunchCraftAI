import { projectService } from "@/lib/services/project.service";
import { notFound } from "next/navigation";
import StartupLandingPage from "@/components/startup-landing-page";

export default async function PublicLandingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        const project = await projectService.getPublicProjectData(id);
        if (!project) return notFound();
        return <StartupLandingPage project={project} />;
    } catch (e) {
        return notFound();
    }
}
