import { auth } from "@/auth";
import { projectService } from "@/lib/services/project.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Rocket,
    Users,
    TrendingUp,
    Plus,
    ChevronRight,
    Zap,
    Clock
} from "lucide-react";
import Link from "next/link";
import { CreateProjectModal } from "@/components/create-project-modal";

export default async function DashboardPage() {
    const session = await auth();
    const projects = await projectService.getUserProjects(session!.user.id);

    // Calculate total leads across all projects
    const totalLeads = projects.reduce((sum, p) => sum + (p._count?.leads || 0), 0);
    const activeProjects = projects.length;

    return (
        <div className="space-y-8 pb-12">
            {/* Welcome Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-purple-700 p-8 md:p-12 text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Welcome back, {session?.user?.name?.split(' ')[0] || 'Founder'}! 🚀
                    </h1>
                    <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                        Ready to launch your next big idea? Your AI assistants are standing by to help you build, validate, and scale.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <CreateProjectModal>
                            <Button size="lg" variant="secondary" className="font-bold shadow-lg hover:shadow-primary/50 transition-all">
                                <Plus className="mr-2 h-5 w-5" />
                                Launch New Idea
                            </Button>
                        </CreateProjectModal>
                        <Link href="/dashboard/projects">
                            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 font-semibold backdrop-blur-sm">
                                View Portfolio
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block opacity-20">
                    <Zap className="w-64 h-64 rotate-12" />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Active Projects", value: activeProjects, icon: Rocket, color: "text-blue-500", bg: "bg-blue-50" },
                    { title: "Total Leads", value: totalLeads, icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { title: "Idea Score", value: "85%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center space-x-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Projects List */}
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50">
                        <div>
                            <CardTitle className="text-xl">Recent Projects</CardTitle>
                            <CardDescription>Your latest startup ventures</CardDescription>
                        </div>
                        <Link href="/dashboard/projects">
                            <Button variant="ghost" size="sm" className="text-primary font-semibold hover:bg-primary/5">
                                See all
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        {projects.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {projects.slice(0, 5).map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/dashboard/projects/${project.id}`}
                                        className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                {project.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{project.name}</h4>
                                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="hidden sm:flex flex-col items-end text-sm">
                                                <span className="font-semibold text-gray-900">{project._count?.leads || 0}</span>
                                                <span className="text-gray-500">leads</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Rocket className="w-8 h-8" />
                                </div>
                                <h4 className="text-lg font-bold mb-2">No projects yet</h4>
                                <p className="text-gray-500 mb-6">Start by creating your first startup project with AI.</p>
                                <CreateProjectModal>
                                    <Button>Initialize Your First Project</Button>
                                </CreateProjectModal>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions & Tips */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <Zap className="w-5 h-5 text-primary mr-2" />
                                Quick Start
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/dashboard/validation" className="block p-3 rounded-xl hover:bg-white shadow-sm transition-all border border-transparent hover:border-primary/20">
                                <h5 className="font-bold text-sm">Validate Idea</h5>
                                <p className="text-xs text-gray-500 font-medium">Get instant AI feedback on your startup idea</p>
                            </Link>
                            <Link href="/dashboard/subscription" className="block p-3 rounded-xl hover:bg-white shadow-sm transition-all border border-transparent hover:border-primary/20">
                                <h5 className="font-bold text-sm">Upgrade Plan</h5>
                                <p className="text-xs text-gray-500 font-medium">Unlock unlimited projects and AI generation</p>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm overflow-hidden group">
                        <div className="p-1 bg-gradient-to-r from-primary to-purple-600" />
                        <CardHeader>
                            <CardTitle className="text-lg">Founder Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                "The best time to start was yesterday. The second best time is right now. Use our AI to build your MVP in minutes instead of weeks."
                            </p>
                            <div className="mt-4 flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform cursor-pointer">
                                Read more guide
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
