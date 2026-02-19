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
    CheckCircle2
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
    const content = lp.content || {};

    const [saveStatus, setSaveStatus] = useState<"IDLE" | "SAVING" | "SUCCESS">("IDLE");

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
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Editor Panel */}
            <div className="xl:col-span-3 space-y-6">
                <Tabs defaultValue="hero" className="w-full">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <TabsList className="bg-white border text-gray-500">
                                    <TabsTrigger value="hero" className="data-[state=active]:text-primary">Hero</TabsTrigger>
                                    <TabsTrigger value="features" className="data-[state=active]:text-primary">Features</TabsTrigger>
                                    <TabsTrigger value="faq" className="data-[state=active]:text-primary">FAQ</TabsTrigger>
                                </TabsList>
                                <div className="flex items-center space-x-2">
                                    <Button size="sm" className="font-bold h-9 shadow-lg shadow-primary/20" onClick={handleSave} disabled={saveStatus === "SAVING"}>
                                        {saveStatus === "SAVING" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        {saveStatus === "SUCCESS" ? "Saved" : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <TabsContent value="hero" className="space-y-6 mt-0">
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">Hero Headline</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="h-12 text-lg font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">Hero Subheadline</Label>
                                    <textarea
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="w-full min-h-[100px] p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/10 outline-none text-gray-600 font-medium whitespace-pre-wrap leading-relaxed resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">CTA Text</Label>
                                    <Input
                                        value={formData.ctaText}
                                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                        className="h-12 font-semibold"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="features" className="space-y-4 mt-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-gray-900">Features List</h4>
                                    <Button variant="outline" size="sm" onClick={addFeature} className="font-bold border-gray-200">
                                        <Plus className="w-4 h-4 mr-1" /> Add Feature
                                    </Button>
                                </div>
                                {formData.features.map((feature: any, index: number) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-2xl space-y-3 relative group">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-gray-400 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
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
                                            className="bg-white border-transparent shadow-sm font-bold"
                                        />
                                        <textarea
                                            placeholder="Feature description"
                                            value={feature.description}
                                            onChange={(e) => {
                                                const newFeatures = [...formData.features];
                                                newFeatures[index].description = e.target.value;
                                                setFormData({ ...formData, features: newFeatures });
                                            }}
                                            className="w-full min-h-[60px] p-3 text-sm bg-white border-none shadow-sm rounded-xl focus:ring-2 focus:ring-primary/10 outline-none text-gray-600 font-medium resize-none"
                                        />
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="faq" className="space-y-4 mt-0">
                                <Button variant="outline" size="sm" className="font-bold w-full border-dashed" onClick={() => setFormData({ ...formData, faq: [...formData.faq, { q: "New Question?", a: "Answer text" }] })}>
                                    <Plus className="w-4 h-4 mr-2" /> Add FAQ Item
                                </Button>
                                {formData.faq.map((item: any, index: number) => (
                                    <div key={index} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/30">
                                        <Input
                                            value={item.q}
                                            onChange={(e) => {
                                                const newFaq = [...formData.faq];
                                                newFaq[index].q = e.target.value;
                                                setFormData({ ...formData, faq: newFaq });
                                            }}
                                            className="mb-2 font-bold bg-white"
                                        />
                                        <textarea
                                            value={item.a}
                                            onChange={(e) => {
                                                const newFaq = [...formData.faq];
                                                newFaq[index].a = e.target.value;
                                                setFormData({ ...formData, faq: newFaq });
                                            }}
                                            className="w-full p-3 text-sm bg-white border-none shadow-sm rounded-xl outline-none text-gray-500 font-medium resize-none"
                                        />
                                    </div>
                                ))}
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>

                <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                            <Rocket className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Your page is live</h4>
                            <p className="text-sm text-gray-500 font-medium">Accessible at /lp/{project.id}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="font-bold" asChild>
                        <a href={`/lp/${project.id}`} target="_blank">View Live <Eye className="ml-2 w-4 h-4" /></a>
                    </Button>
                </div>
            </div>

            {/* Mini Preview Panel */}
            <div className="xl:col-span-2 relative hidden xl:block">
                <div className="sticky top-24">
                    <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -rotate-2" />
                    <Card className="relative border-none shadow-2xl rounded-[2.5rem] overflow-hidden ring-8 ring-white aspect-[9/16] max-h-[750px] mx-auto">
                        <div className="absolute inset-0 overflow-y-auto bg-white pointer-events-none origin-top h-full">
                            {/* Simulated Header */}
                            <div className="p-6 flex items-center justify-between border-b scale-75 origin-top-left w-[133%]">
                                <div className="flex items-center space-x-2 font-black text-xl">
                                    <Rocket className="w-6 h-6 text-primary" />
                                    <span>{project.name}</span>
                                </div>
                                <Button size="sm" className="font-bold h-8">Join</Button>
                            </div>

                            {/* Simulated Hero */}
                            <div className="p-8 text-center space-y-6 pt-12 scale-75 origin-top w-[133%] -ml-[16.5%]">
                                <h1 className="text-4xl font-black text-gray-900 leading-tight tracking-tighter">
                                    {formData.title}
                                </h1>
                                <p className="text-gray-500 text-lg leading-relaxed px-4">
                                    {formData.subtitle}
                                </p>
                                <Button className="w-full h-14 text-xl font-black rounded-2xl shadow-xl shadow-primary/20">
                                    {formData.ctaText}
                                </Button>
                            </div>

                            {/* Simulated Features */}
                            <div className="p-8 scale-75 origin-top w-[133%] -ml-[16.5%] space-y-4">
                                {formData.features.slice(0, 2).map((f: any, i: number) => (
                                    <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <div className="w-10 h-10 bg-white rounded-xl mb-3 flex items-center justify-center shadow-sm text-primary">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-bold mb-1">{f.title}</h4>
                                        <p className="text-sm text-gray-500">{f.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                            Mobile Preview
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
