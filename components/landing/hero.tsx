"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles, ArrowRight, Shield, Zap } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full text-sm font-bold text-gray-900 mb-8 shadow-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>AI-Powered Startup Builder 2.0</span>
                    </div>
                </motion.div>

                <motion.h1
                    className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Launch Your <span className="gradient-text">Startup</span> <br />
                    In <span className="relative">
                        Seconds
                        <motion.div
                            className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        />
                    </span>
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    The structured Startup MVP Builder for founders. Generate landing pages,
                    pitch decks, and business plans with high-precision AI.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link href="/register">
                        <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/30 group">
                            Get Started for Free
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="#pricing">
                        <Button size="lg" variant="ghost" className="h-14 px-10 text-lg font-bold border-2 border-transparent hover:border-gray-100 transition-all">
                            View Pricing
                        </Button>
                    </Link>
                </motion.div>

                {/* Floating Metrics UI Placeholder */}
                <motion.div
                    className="mt-20 relative max-w-5xl mx-auto"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-2xl overflow-hidden ring-1 ring-gray-100">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="h-10 bg-gray-50 border-b flex items-center px-4 space-x-2">
                                <div className="w-3 h-3 bg-red-400 rounded-full" />
                                <div className="w-3 h-3 bg-amber-400 rounded-full" />
                                <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                                <div className="flex-1 text-center">
                                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">LaunchCraft Dashboard preview</span>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80 pointer-events-none">
                                <div className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
                                <div className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
                                <div className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
                                <div className="md:col-span-2 h-64 bg-gray-50 rounded-2xl animate-pulse" />
                                <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Floating Badges */}
                    <div className="absolute top-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-3 hidden lg:flex">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">SECURE DATA</p>
                            <p className="text-sm font-black">Encrypted & Private</p>
                        </div>
                    </div>

                    <div className="absolute bottom-20 -right-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-3 hidden lg:flex">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">AI GENERATION</p>
                            <p className="text-sm font-black">Under 60 Seconds</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
