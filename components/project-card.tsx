"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Rocket,
    Users,
    Layout,
    Presentation,
    FileText,
    ChevronRight,
    MoreVertical,
    Calendar,
    Zap,
    CheckCircle,
    Clock
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
    project: any;
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Rocket className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                            {project.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/projects/${project.id}/settings`}>Project Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            Archive Project
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {project.description || "No description provided for this project."}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-gray-50/50 p-3 rounded-xl flex items-center space-x-3">
                        <Users className="w-4 h-4 text-emerald-500" />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">{project._count?.leads || 0}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-semibold">Leads</span>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 p-3 rounded-xl flex items-center space-x-3">
                        <Layout className="w-4 h-4 text-blue-500" />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">{project.landingPage ? 'Active' : 'N/A'}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-semibold">Landing Page</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    {project.landingPage && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                    <span className="text-xs font-medium text-gray-500">
                        {project.landingPage ? 'Live and capturing leads' : 'Creation in progress'}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="bg-gray-50/30 p-4 border-t border-gray-100/50 flex items-center gap-3">
                <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                    <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 hover:text-primary group/btn font-bold">
                        Open Studio
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </Link>
                {project.landingPage && (
                    <Button variant="outline" size="sm" className="h-9 px-4 border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl shadow-sm whitespace-nowrap" asChild>
                        <a href={`/lp/${project.id}`} target="_blank">
                            <Layout className="mr-2 h-4 w-4" />
                            View Live
                        </a>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
