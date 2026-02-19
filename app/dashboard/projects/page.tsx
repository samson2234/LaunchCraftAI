import { auth } from "@/auth";
import { projectService } from "@/lib/services/project.service";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Rocket } from "lucide-react";
import { CreateProjectModal } from "@/components/create-project-modal";
import { ProjectCard } from "@/components/project-card";

export default async function ProjectsPage() {
    const session = await auth();
    const projects = await projectService.getUserProjects(session!.user.id);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Manage and scale your startup portfolio</p>
                </div>
                <CreateProjectModal>
                    <Button size="lg" className="shadow-lg shadow-primary/20 font-bold h-12 px-8">
                        <Plus className="mr-2 h-5 w-5" />
                        Create New Project
                    </Button>
                </CreateProjectModal>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by project name or description..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm h-10"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="rounded-xl flex-1 sm:flex-none h-10">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" className="rounded-xl flex-1 sm:flex-none h-10">
                        Date Updated
                    </Button>
                </div>
            </div>

            {/* Project Grid */}
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Rocket className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">No projects yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-8 text-lg">
                        You haven't created any startup projects yet. Let's launch your first idea today!
                    </p>
                    <CreateProjectModal>
                        <Button size="lg" className="px-12 font-bold h-14 text-lg">
                            Get Started
                        </Button>
                    </CreateProjectModal>
                </div>
            )}
        </div>
    );
}
