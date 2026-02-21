"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    Target,
    Zap,
    History,
    FileText,
    Sparkles,
    ChevronRight,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ValidationEntry {
    id: string;
    question: string;
    score: number | null;
    notes: string | null;
    createdAt: string | Date;
}

interface ValidationTrackerProps {
    entries: ValidationEntry[];
    projectName: string;
}

export function ValidationTracker({ entries, projectName }: ValidationTrackerProps) {
    const [selectedEntry, setSelectedEntry] = useState<ValidationEntry | null>(entries[0] || null);

    const parseNotes = (notes: string | null) => {
        try {
            return notes ? JSON.parse(notes) : null;
        } catch (e) {
            return null;
        }
    };

    if (entries.length === 0) {
        return (
            <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No idea validation data</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-8">
                    Run the AI validation tool to get feedback on your startup idea.
                </p>
            </div>
        );
    }

    const currentData = selectedEntry ? parseNotes(selectedEntry.notes) : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar: History */}
            <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <History className="w-5 h-5 mr-2 text-primary" />
                        History
                    </h3>
                </div>
                <div className="space-y-3">
                    {entries.map((entry) => (
                        <button
                            key={entry.id}
                            onClick={() => setSelectedEntry(entry)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedEntry?.id === entry.id
                                    ? "bg-primary/5 border-primary shadow-sm"
                                    : "bg-white border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <Badge variant="outline" className={`font-black tracking-tight ${(entry.score || 0) >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                                        (entry.score || 0) >= 50 ? "text-amber-600 bg-amber-50 border-amber-100" :
                                            "text-red-600 bg-red-50 border-red-100"
                                    }`}>
                                    SCORE: {entry.score || "N/A"}
                                </Badge>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                                    {new Date(entry.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-gray-900 line-clamp-2 mt-2">
                                {entry.question.replace("AI Validation Result", "").replace("Idea: ", "")}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content: Report */}
            <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                    {selectedEntry && currentData && (
                        <motion.div
                            key={selectedEntry.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Score Card */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-10">
                                    <Sparkles className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Sparkles className="w-5 h-5 text-amber-400" />
                                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">AI Validation Report</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <h2 className="text-5xl font-black italic tracking-tighter mb-2">
                                                {selectedEntry.score}%
                                            </h2>
                                            <p className="text-gray-400 font-medium max-w-md">
                                                Your idea has been analyzed based on market potential, execution risk, and competitive landscape.
                                            </p>
                                        </div>
                                        <div className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest ${(selectedEntry.score || 0) >= 80 ? "bg-emerald-500 text-white" :
                                                (selectedEntry.score || 0) >= 50 ? "bg-amber-500 text-white" :
                                                    "bg-red-500 text-white"
                                            }`}>
                                            {(selectedEntry.score || 0) >= 80 ? "Strong Potential" :
                                                (selectedEntry.score || 0) >= 50 ? "Needs Pivot" :
                                                    "High Risk"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-emerald-50/50 border-b border-emerald-50 p-6">
                                        <CardTitle className="text-lg flex items-center text-emerald-700">
                                            <TrendingUp className="w-5 h-5 mr-2" />
                                            Strengths
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <ul className="space-y-3">
                                            {currentData.strengths?.map((s: string, i: number) => (
                                                <li key={i} className="flex items-start">
                                                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 mt-1 flex-shrink-0" />
                                                    <span className="text-sm font-medium text-gray-700">{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-red-50/50 border-b border-red-50 p-6">
                                        <CardTitle className="text-lg flex items-center text-red-700">
                                            <AlertCircle className="w-5 h-5 mr-2" />
                                            Weaknesses
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <ul className="space-y-3">
                                            {currentData.weaknesses?.map((w: string, i: number) => (
                                                <li key={i} className="flex items-start">
                                                    <AlertCircle className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0" />
                                                    <span className="text-sm font-medium text-gray-700">{w}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recommendations */}
                            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="bg-primary/5 border-b border-primary/10 p-6">
                                    <CardTitle className="text-lg flex items-center text-primary">
                                        <Zap className="w-5 h-5 mr-2" />
                                        Strategic Recommendations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentData.recommendations?.map((r: string, i: number) => (
                                            <div key={i} className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <ArrowUpRight className="w-4 h-4 mr-3 text-primary" />
                                                <span className="text-sm font-bold text-gray-800">{r}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Market Potential & Competition */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Market Potential</h4>
                                    <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                                        <p className="text-xl font-black text-gray-900 mb-1">{currentData.marketPotential}</p>
                                        <p className="text-sm text-gray-500 font-medium italic">Global scalability assessment</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Competition</h4>
                                    <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                                        <p className="text-sm font-bold text-gray-700 leading-relaxed">{currentData.competitiveLandscape}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
