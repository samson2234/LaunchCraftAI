"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    FileText,
    TrendingUp,
    Target,
    Compass,
    Download,
    CheckCircle2,
    Calendar,
    ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BusinessPlanViewerProps {
    plan: any;
}

export function BusinessPlanViewer({ plan }: BusinessPlanViewerProps) {
    if (!plan || !plan.executiveSummary) {
        return (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No Business Plan</h3>
                <p className="text-gray-500 mt-2">Generate a comprehensive roadmap and strategy for your startup.</p>
            </div>
        );
    }

    const sections = [
        { id: 'summary', title: 'Executive Summary', icon: Target, content: plan.executiveSummary },
        { id: 'market', title: 'Market Analysis', icon: TrendingUp, content: plan.marketAnalysis },
        { id: 'strategy', title: 'Growth Strategy', icon: Compass, content: plan.strategy },
        { id: 'financial', title: 'Financial Outlook', icon: Calendar, content: plan.financialPlan },
    ];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div>
                    <h3 className="text-3xl font-black text-gray-900 italic tracking-tight">Strategic Business Plan</h3>
                    <div className="flex items-center mt-2 space-x-3">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none">AI Generated</Badge>
                        <span className="text-sm text-gray-400 font-medium italic">Last updated: {new Date(plan.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <Button variant="outline" className="font-bold border-gray-200">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {sections.map((section) => (
                    <Card key={section.id} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-shadow">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black">{section.title}</CardTitle>
                                    <CardDescription className="text-gray-500 font-medium">Strategic roadmap and detailed analysis</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            {typeof section.content === 'string' ? (
                                <p className="text-gray-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">{section.content}</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {Object.entries(section.content || {}).map(([key, val]: [string, any]) => (
                                        <div key={key} className="space-y-2">
                                            <h5 className="font-black text-sm uppercase tracking-widest text-primary/60">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                                            <p className="text-gray-700 font-medium leading-relaxed">
                                                {Array.isArray(val) ? val.join(', ') : String(val)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
