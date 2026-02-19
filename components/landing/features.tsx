"use client";

import { motion } from "framer-motion";
import {
    Rocket,
    Presentation,
    FileText,
    Users,
    Zap,
    Sparkles,
    Layout,
    BarChart3
} from "lucide-react";

const features = [
    {
        title: "AI Landing Pages",
        description: "Generate high-converting landing pages tailored to your startup niche. optimized for conversions from day one.",
        icon: Layout,
        color: "bg-blue-500",
    },
    {
        title: "Pitch Deck Suite",
        description: "Professional slides structured for investors. Our AI generates the narrative, the market data projections, and the vision.",
        icon: Presentation,
        color: "bg-purple-500",
    },
    {
        title: "Lead Management",
        description: "Built-in CRM to track your waitlist. See exactly who is interested in your project and export data with one click.",
        icon: Users,
        color: "bg-emerald-500",
    },
    {
        title: "Business Planning",
        description: "Detailed 5-year business roadmaps. SWAT analysis, financial projections, and go-to-market strategies generated in seconds.",
        icon: FileText,
        color: "bg-amber-500",
    },
    {
        title: "Real-time Metrics",
        description: "Track visitors and conversion rates in real-time. Know exactly which version of your vision is resonating.",
        icon: BarChart3,
        color: "bg-rose-500",
    },
    {
        title: "Lightning Export",
        description: "Export everything you build to PDF, HTML, or JSON. Take your startup data wherever you need it next.",
        icon: Zap,
        color: "bg-cyan-500",
    },
];

export function Features() {
    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Built for <span className="gradient-text">Speed</span>. <br className="hidden md:block" /> Engineered for Success.
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-500 font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        LaunchCraft gives you the same tools as billion-dollar startups,
                        optimized for the lean founder approach.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border border-transparent hover:border-gray-100"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center text-white shadow-lg mb-8 group-hover:scale-110 transition-transform`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
