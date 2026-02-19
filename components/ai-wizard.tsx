"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    Loader2,
    CheckCircle2,
    Rocket,
    Zap,
    Presentation,
    Layout,
    ArrowRight,
    Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface AIWizardProps {
    projectId: string;
    projectName: string;
    children: React.ReactNode;
}

type WizardStep = "SELECT" | "GENERATING" | "SUCCESS";

export function AIWizard({ projectId, projectName, children }: AIWizardProps) {
    const [step, setStep] = useState<WizardStep>("SELECT");
    const [generating, setGenerating] = useState(false);
    const [completed, setCompleted] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    async function handleGenerate() {
        setStep("GENERATING");
        setGenerating(true);
        setCompleted([]);

        try {
            // 1. Generate Landing Page
            const lpRes = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "LANDING_PAGE",
                    data: { projectId }
                })
            });
            if (lpRes.ok) setCompleted(prev => [...prev, "LANDING_PAGE"]);

            // 2. Generate Pitch Deck
            const pdRes = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "PITCH_DECK",
                    data: { projectId }
                })
            });
            if (pdRes.ok) setCompleted(prev => [...prev, "PITCH_DECK"]);

            // 3. Generate Business Plan
            const bpRes = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "BUSINESS_PLAN",
                    data: { projectId }
                })
            });
            if (bpRes.ok) setCompleted(prev => [...prev, "BUSINESS_PLAN"]);

            setStep("SUCCESS");
        } catch (error) {
            console.error("Generation failed:", error);
            // Reset or show error
        } finally {
            setGenerating(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-gradient-to-br from-gray-900 to-primary p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">AI Launch Wizard</h2>
                            <p className="text-white/60 text-sm font-medium">Building {projectName}...</p>
                        </div>
                    </div>
                    <Zap className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-48 h-48 text-white/5 rotate-12" />
                </div>

                <div className="p-8 bg-white min-h-[350px] flex flex-col">
                    <AnimatePresence mode="wait">
                        {step === "SELECT" && (
                            <motion.div
                                key="select"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 flex-1"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900">What should we build?</h3>
                                    <p className="text-gray-500 font-medium">Select the components you want the AI to generate for your startup.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { id: "LP", title: "Landing Page", desc: "Copy, hero, features & pricing", icon: Layout },
                                        { id: "PD", title: "Pitch Deck", desc: "10-slide startup investor deck", icon: Presentation },
                                        { id: "BP", title: "Business Plan", desc: "SWOT, Roadmap & Financials", icon: Zap },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center p-4 border rounded-2xl border-gray-100 bg-gray-50/50 hover:bg-white hover:border-primary/20 hover:shadow-md transition-all group">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm mr-4 group-hover:scale-110 transition-transform">
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900">{item.title}</h4>
                                                <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                                            </div>
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    <Button size="lg" className="w-full h-14 font-black shadow-xl shadow-primary/20" onClick={handleGenerate}>
                                        Generate Everything
                                        <Sparkles className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === "GENERATING" && (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="flex-1 flex flex-col items-center justify-center py-12 text-center"
                            >
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                                    </div>
                                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                                <h3 className="text-2xl font-black mb-2">Magic in progress...</h3>
                                <p className="text-gray-500 font-medium mb-8">Our AI is drafting your startup assets. This takes about 30 seconds.</p>

                                <div className="w-full max-w-sm space-y-3">
                                    {[
                                        { id: "LANDING_PAGE", label: "Generating Landing Page Copy" },
                                        { id: "PITCH_DECK", label: "Structuring Pitch Deck Slides" },
                                        { id: "BUSINESS_PLAN", label: "Synthesizing Business Model" },
                                    ].map((task) => (
                                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="text-sm font-bold text-gray-700">{task.label}</span>
                                            {completed.includes(task.id) ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === "SUCCESS" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1 flex flex-col items-center justify-center py-8 text-center"
                            >
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-500 shadow-xl shadow-emerald-500/10 border-4 border-white">
                                    <Rocket className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-black mb-2 text-gray-900">Ready for Launch!</h3>
                                <p className="text-gray-500 font-medium mb-10 max-w-xs">Everything has been generated. You can now preview and edit your assets.</p>

                                <div className="grid grid-cols-1 w-full gap-3">
                                    <Button size="lg" className="w-full h-12 font-bold" onClick={() => { setOpen(false); router.refresh(); }}>
                                        Go to Dashboard
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full h-12 font-bold border-gray-100" onClick={() => setStep("SELECT")}>
                                        Generate More
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
