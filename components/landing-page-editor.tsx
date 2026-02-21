"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Save,
    Eye,
    Sparkles,
    Layout,
    Type,
    MessageSquare,
    Settings2,
    Loader2,
    Rocket,
    Plus,
    Trash2,
    CheckCircle2,
    Code,
    Download,
    Send,
    RefreshCw
} from "lucide-react";

interface Feature {
    title: string;
    description: string;
    icon: string;
}

interface FAQ {
    q: string;
    a: string;
}

interface LandingPageEditorProps {
    project: any;
}

export function LandingPageEditor({ project }: LandingPageEditorProps) {
    const lp = project.landingPage || {};
    const [content, setContent] = useState(lp.content || {});
    const [saveStatus, setSaveStatus] = useState<"IDLE" | "SAVING" | "SUCCESS">("IDLE");
    const [isRefining, setIsRefining] = useState(false);
    const [refinePrompt, setRefinePrompt] = useState("");

    const [formData, setFormData] = useState({
        title: lp.title || project.name,
        subtitle: lp.subtitle || project.description || "",
        ctaText: content.ctaText || "Get Started",
        features: content.features || [
            { title: "Feature 1", description: "Description 1", icon: "Zap" },
            { title: "Feature 2", description: "Description 2", icon: "Shield" },
        ],
        faq: content.faq || [
            { q: "Question 1?", a: "Answer 1" }
        ],
    });

    async function handleSave() {
        setSaveStatus("SAVING");
        try {
            const res = await fetch(`/api/landing-pages/${lp.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    subtitle: formData.subtitle,
                    content: {
                        ...content,
                        ctaText: formData.ctaText,
                        features: formData.features,
                        faq: formData.faq,
                    }
                })
            });
            if (res.ok) {
                setSaveStatus("SUCCESS");
                setTimeout(() => setSaveStatus("IDLE"), 2000);
            }
        } catch (error) {
            console.error(error);
            setSaveStatus("IDLE");
        }
    }

    async function handleRefine() {
        if (!refinePrompt.trim()) return;
        setIsRefining(true);
        try {
            const res = await fetch("/api/ai/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    landingPageId: lp.id,
                    instruction: refinePrompt
                })
            });

            if (res.ok) {
                const updatedLp = await res.json();
                setContent(updatedLp.content);
                setFormData({
                    title: updatedLp.title,
                    subtitle: updatedLp.subtitle,
                    ctaText: updatedLp.content.ctaText || "Get Started",
                    features: updatedLp.content.features || [],
                    faq: updatedLp.content.faq || []
                });
                setRefinePrompt("");
            }
        } catch (error) {
            console.error("Refinement failed:", error);
        } finally {
            setIsRefining(false);
        }
    }

    const handleDownload = () => {
        const code = content.rawCode || "<!-- No code generated yet -->";
        const blob = new Blob([code], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-landing-page.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, { title: "New Feature", description: "Feature description", icon: "Zap" }]
        });
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_: any, i: number) => i !== index)
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* AI Studio Prompt Bar */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white rounded-[1.8rem] border border-gray-100 p-2 shadow-xl">
                    <div className="flex-1 flex items-center px-4">
                        <Sparkles className="w-5 h-5 text-primary mr-3" />
                        <input
                            placeholder="Tell AI to change anything... e.g. 'Make the hero more aggressive' or 'Add a section for social proof'"
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-medium placeholder:text-gray-400"
                            value={refinePrompt}
                            onChange={(e) => setRefinePrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                        />
                    </div>
                    <Button
                        onClick={handleRefine}
                        disabled={isRefining || !refinePrompt.trim()}
                        className="rounded-full px-6 h-12 bg-gray-900 hover:bg-black text-white font-bold transition-all flex items-center shadow-lg"
                    >
                        {isRefining ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        {isRefining ? "Refining..." : "Refine Page"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* Editor Panel */}
                <div className="xl:col-span-3 space-y-6">
                    <Tabs defaultValue="design" className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-gray-100/50 p-1 rounded-xl">
                                <TabsTrigger value="design" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Design</TabsTrigger>
                                <TabsTrigger value="code" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Code</TabsTrigger>
                            </TabsList>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={handleDownload} className="font-bold rounded-lg border-gray-200">
                                    <Download className="w-4 h-4 mr-2" /> Download HTML
                                </Button>
                                <Button size="sm" className="font-bold rounded-lg shadow-lg shadow-primary/20" onClick={handleSave} disabled={saveStatus === "SAVING"}>
                                    {saveStatus === "SAVING" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    {saveStatus === "SUCCESS" ? "Saved" : "Save Draft"}
                                </Button>
                            </div>
                        </div>

                        <TabsContent value="design" className="mt-0">
                            <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
                                <CardContent className="p-8 space-y-8">
                                    {/* Traditional Editor Fields */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-gray-700 flex items-center">
                                                <Type className="w-4 h-4 mr-2 text-primary" /> Hero Headline
                                            </Label>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="h-14 text-xl font-black rounded-2xl border-gray-100 bg-gray-50/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-gray-700 flex items-center">
                                                <MessageSquare className="w-4 h-4 mr-2 text-primary" /> Subheadline
                                            </Label>
                                            <textarea
                                                value={formData.subtitle}
                                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                className="w-full min-h-[120px] p-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none text-gray-600 font-medium leading-relaxed resize-none"
                                            />
                                        </div>

                                        <div className="pt-4 border-t border-gray-50">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="font-bold text-gray-900 flex items-center">
                                                    <Layout className="w-4 h-4 mr-2 text-primary" /> Features Configuration
                                                </h4>
                                                <Button variant="outline" size="sm" onClick={addFeature} className="rounded-xl border-gray-200 font-bold">
                                                    <Plus className="w-4 h-4 mr-1" /> Add Feature
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                {formData.features.map((feature: any, index: number) => (
                                                    <div key={index} className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4 group relative">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute top-4 right-4 text-gray-300 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                            onClick={() => removeFeature(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                        <Input
                                                            placeholder="Feature title"
                                                            value={feature.title}
                                                            onChange={(e) => {
                                                                const newFeatures = [...formData.features];
                                                                newFeatures[index].title = e.target.value;
                                                                setFormData({ ...formData, features: newFeatures });
                                                            }}
                                                            className="bg-white border-none shadow-sm font-bold h-12 rounded-xl"
                                                        />
                                                        <textarea
                                                            placeholder="Feature description"
                                                            value={feature.description}
                                                            onChange={(e) => {
                                                                const newFeatures = [...formData.features];
                                                                newFeatures[index].description = e.target.value;
                                                                setFormData({ ...formData, features: newFeatures });
                                                            }}
                                                            className="w-full min-h-[80px] p-4 text-sm bg-white border-none shadow-sm rounded-xl focus:ring-2 focus:ring-primary/10 outline-none text-gray-600 font-medium resize-none"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="code" className="mt-0">
                            <Card className="border-none shadow-sm overflow-hidden rounded-3xl bg-gray-900">
                                <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur-md">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Main.html</span>
                                </div>
                                <CardContent className="p-0">
                                    <div className="relative group">
                                        <pre className="p-8 text-sm text-gray-300 font-mono overflow-auto max-h-[600px] leading-relaxed selection:bg-primary/30">
                                            {content.rawCode || "<!-- Use AI Launch Wizard to generate the code for this page -->"}
                                        </pre>
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border-white/10"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(content.rawCode || "");
                                                }}
                                            >
                                                Copy Code
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Live Preview Console */}
                <div className="xl:col-span-2 relative">
                    <div className="sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-900 flex items-center">
                                <Eye className="w-4 h-4 mr-2 text-primary" /> Device Preview
                            </h4>
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Live Updates</span>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -rotate-2 group-hover:rotate-0 transition-transform duration-700" />
                            <Card className="relative border-none shadow-2xl rounded-[3rem] overflow-hidden ring-8 ring-white aspect-[9/16] max-h-[750px] mx-auto bg-white flex flex-col">
                                {content.rawCode ? (
                                    <iframe
                                        srcDoc={content.rawCode}
                                        className="w-full h-full border-none"
                                        title="Landing Page Preview"
                                    />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                                            <Sparkles className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <h5 className="font-bold text-gray-900 mb-2">No Preview Available</h5>
                                        <p className="text-sm text-gray-400 font-medium mb-6">Use the AI Studio at the top to generate your high-end design.</p>
                                    </div>
                                )}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 shadow-xl">
                                    Mobile Preview
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

