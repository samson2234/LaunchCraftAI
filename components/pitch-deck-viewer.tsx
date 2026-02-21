"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Download,
    Presentation,
    Sparkles,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
    title: string;
    content: string;
    bullets?: string[];
}

interface PitchDeckViewerProps {
    pitchDeck: any;
}

export function PitchDeckViewer({ pitchDeck }: PitchDeckViewerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isRefining, setIsRefining] = useState(false);
    const [refinePrompt, setRefinePrompt] = useState("");
    const [slides, setSlides] = useState((pitchDeck.slides as Slide[]) || []);

    if (slides.length === 0) {
        return (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                <Presentation className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No Slides Generated</h3>
                <p className="text-gray-500 mt-2">Use the AI generator to create your investor pitch deck.</p>
            </div>
        );
    }

    async function handleRefine() {
        if (!refinePrompt.trim()) return;
        setIsRefining(true);
        try {
            const res = await fetch("/api/ai/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pitchDeckId: pitchDeck.id,
                    instruction: refinePrompt
                })
            });

            if (res.ok) {
                const updated = await res.json();
                setSlides(updated.slides);
                setRefinePrompt("");
            }
        } catch (error) {
            console.error("Refinement failed:", error);
        } finally {
            setIsRefining(false);
        }
    }

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="space-y-6">
            {/* AI Studio Bar */}
            <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 p-1 rounded-2xl shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-pulse" />
                <div className="bg-gray-900/90 backdrop-blur-xl p-4 rounded-xl relative z-10 flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Tell the AI to update the deck... (e.g., 'Make the solution slide more data-heavy' or 'Add a slide about competitive advantage')"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 outline-none focus:border-primary/50 transition-all font-medium"
                            value={refinePrompt}
                            onChange={(e) => setRefinePrompt(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRefine()}
                        />
                    </div>
                    <Button
                        onClick={handleRefine}
                        disabled={isRefining || !refinePrompt.trim()}
                        className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {isRefining ? <Loader2 className="w-5 h-5 animate-spin" /> : "Refine Slides"}
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-gray-900">{pitchDeck.title}</h3>
                    <p className="text-gray-500 font-medium">Slide {currentSlide + 1} of {slides.length}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="font-bold border-gray-200">
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </Button>
                    <Button size="sm" className="font-bold shadow-lg shadow-primary/20">
                        <Maximize2 className="w-4 h-4 mr-2" /> Presentation Mode
                    </Button>
                </div>
            </div>

            <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute inset-0 bg-gradient-to-br from-gray-900 to-primary rounded-[2.5rem] p-12 text-white flex flex-col justify-center shadow-2xl overflow-hidden"
                    >
                        <Sparkles className="absolute top-10 right-10 w-12 h-12 text-white/10" />
                        <div className="relative z-10 max-w-3xl">
                            <h2 className="text-5xl font-black mb-8 tracking-tighter leading-none italic">
                                {slides[currentSlide].title}
                            </h2>
                            <p className="text-2xl text-white/80 font-medium leading-relaxed mb-8">
                                {slides[currentSlide].content}
                            </p>
                            {slides[currentSlide].bullets && (
                                <ul className="space-y-4">
                                    {slides[currentSlide].bullets!.map((bullet, i) => (
                                        <li key={i} className="flex items-center text-xl font-bold">
                                            <div className="w-2 h-2 bg-white rounded-full mr-4" />
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="absolute bottom-10 right-12 text-white/20 font-black text-8xl -z-0 select-none">
                            {currentSlide + 1}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={nextSlide}
                >
                    <ChevronRight className="w-8 h-8" />
                </Button>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 overflow-x-auto pb-4">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'bg-primary w-full' : 'bg-gray-200 w-full'}`}
                    />
                ))}
            </div>
        </div>
    );
}
