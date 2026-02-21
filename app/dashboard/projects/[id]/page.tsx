import { auth } from "@/auth";
import { projectService } from "@/lib/services/project.service";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Rocket,
    Layout,
    Users,
    Presentation,
    FileText,
    Settings,
    ExternalLink,
    ChevronLeft,
    Sparkles,
    Zap,
    CheckCircle
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AIWizard } from "@/components/ai-wizard";
import { LandingPageEditor } from "@/components/landing-page-editor";
import { PitchDeckViewer } from "@/components/pitch-deck-viewer";
import { BusinessPlanViewer } from "@/components/business-plan-viewer";
import { LeadsTable } from "@/components/leads-table";
import { ValidationTracker } from "@/components/validation-tracker";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

// Placeholder components for tabs - will implement these in follow-up steps
const ProjectOverview = ({ project }: { project: any }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Users className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Total Leads</p>
                <h3 className="text-2xl font-bold">{project._count?.leads || 0}</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Layout className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">LP Views</p>
                <h3 className="text-2xl font-bold">124</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Presentation className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Deck Ready</p>
                <h3 className="text-2xl font-bold">{project.pitchDeck ? 'Yes' : 'No'}</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <FileText className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Business Plan</p>
                <h3 className="text-2xl font-bold">Draft</h3>
            </div>
        </div>

        {/* Magic AI CTA */}
        <div className="lg:col-span-4 mt-8 bg-gradient-to-r from-gray-900 to-primary p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Build Everything with LaunchCraft AI</h3>
                <p className="text-white/80 max-w-xl">
                    Our AI can generate a professional landing page, a pitch deck, and a business plan tailored to your startup idea in seconds.
                </p>
            </div>
            <AIWizard projectId={project.id} projectName={project.name}>
                <Button size="lg" variant="secondary" className="font-bold relative z-10 px-8 h-12 shadow-lg hover:shadow-primary/50 transition-all">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Open AI Wizard
                </Button>
            </AIWizard>
            <Zap className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-64 h-64 text-white/5 rotate-12" />
        </div>
    </div>
);

export default async function ProjectDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const { id } = await params;

    const project = await projectService.getProjectById(id, session!.user.id);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Project Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/projects">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white shadow-sm border border-transparent hover:border-gray-100 transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                            {project.landingPage && (
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-bold px-3 border-none">
                                    LIVE
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-500 mt-1 flex items-center">
                            <span className="truncate max-w-md">{project.description}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {project.landingPage && (
                        <Button variant="outline" className="h-12 px-6 border-emerald-100 bg-emerald-50/30 text-emerald-700 hover:bg-emerald-100 font-bold rounded-2xl shadow-sm transition-all" asChild>
                            <a href={`/lp/${project.id}`} target="_blank">
                                <Layout className="mr-2 h-5 w-5" />
                                Preview Site
                            </a>
                        </Button>
                    )}
                    <AIWizard projectId={project.id} projectName={project.name}>
                        <Button className="h-12 px-6 font-bold shadow-xl shadow-primary/20 rounded-2xl bg-gradient-to-r from-primary to-purple-600 border-none hover:shadow-primary/40 transition-all">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Launch AI Wizard
                        </Button>
                    </AIWizard>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-gray-100/50 p-1 w-full md:w-auto h-12 rounded-2xl border border-gray-100 inline-flex">
                    {[
                        { value: "overview", label: "Overview", icon: Rocket },
                        { value: "landing", label: "Landing Page", icon: Layout },
                        { value: "leads", label: "Leads", icon: Users },
                        { value: "deck", label: "Pitch Deck", icon: Presentation },
                        { value: "plan", label: "Business Plan", icon: FileText },
                        { value: "validation", label: "Validation", icon: CheckCircle }, // Added Validation tab
                        { value: "settings", label: "Settings", icon: Settings },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-xl px-6 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-semibold transition-all flex items-center space-x-2"
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                    <ProjectOverview project={project} />
                </TabsContent>

                <TabsContent value="landing" className="mt-0 space-y-4">
                    {project.landingPage ? (
                        <LandingPageEditor project={project} />
                    ) : (
                        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                            <Layout className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold">Landing Page Creator</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8 mt-2">
                                Generate a high-converting landing page for your project using AI.
                            </p>
                            <AIWizard projectId={project.id} projectName={project.name}>
                                <Button className="font-bold">Initialize AI Builder</Button>
                            </AIWizard>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="leads" className="mt-0">
                    <LeadsTable leads={project.leads || []} projectName={project.name} />
                </TabsContent>

                <TabsContent value="deck" className="mt-0">
                    {project.pitchDeck ? (
                        <PitchDeckViewer pitchDeck={project.pitchDeck} />
                    ) : (
                        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                            <Presentation className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold">Investor Pitch Deck</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8 mt-2">
                                Create a stunning 10-slide pitch deck to impress investors and partners.
                            </p>
                            <AIWizard projectId={project.id} projectName={project.name}>
                                <Button className="font-bold">Generate with AI</Button>
                            </AIWizard>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="validation" className="mt-0">
                    <ValidationTracker entries={project.validationEntries || []} projectName={project.name} />
                </TabsContent>

                <TabsContent value="plan" className="mt-0">
                    {project.businessPlan ? (
                        <BusinessPlanViewer plan={project.businessPlan} />
                    ) : (
                        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold">Comprehensive Business Plan</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8 mt-2">
                                Map out your market strategy, financial outlook, and roadmap.
                            </p>
                            <AIWizard projectId={project.id} projectName={project.name}>
                                <Button className="font-bold">Build Strategic Plan</Button>
                            </AIWizard>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                    <Card className="border-gray-100 shadow-sm rounded-3xl overflow-hidden px-8">
                        <CardHeader className="px-0">
                            <CardTitle>Project Settings</CardTitle>
                            <CardDescription>Manage your project details and visibility.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0 space-y-6 pb-8">
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-red-900 leading-none mb-1">Danger Zone</h4>
                                    <p className="text-sm text-red-600 font-medium">Permanently delete this project and all associated data.</p>
                                </div>
                                <Button variant="destructive" className="font-bold">Delete Project</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

