"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        content: "LaunchCraft AI completely changed how I think about validating ideas. I went from a concept to a live landing page and 10 leads in under 24 hours.",
        author: "Sarah Jenkins",
        role: "Founder, Bloom AI",
        avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
        content: "The pitch deck generator is pure magic. It saved me weeks of work and the slides looked professional enough to take straight to our seed round meetings.",
        author: "Marcus Thorne",
        role: "CEO, StreamFlow",
        avatar: "https://i.pravatar.cc/150?u=marcus",
    },
    {
        content: "As a non-technical founder, I always felt stuck during the MVP phase. LaunchCraft gave me the tools to build and test like a full developer team.",
        author: "Elena Rodriguez",
        role: "Product Lead, EcoSync",
        avatar: "https://i.pravatar.cc/150?u=elena",
    },
];

export function Testimonials() {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Loved by <span className="gradient-text">Founders</span> Worldwide
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-500 font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Join over 5,000+ creators who used LaunchCraft to start their journey.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-gray-50 p-8 rounded-3xl relative border border-gray-100/50"
                        >
                            <div className="flex text-amber-400 mb-6">
                                {[...Array(5)].map((_, star) => (
                                    <Star key={star} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <Quote className="absolute top-6 right-8 w-12 h-12 text-gray-200/50 -z-0" />
                            <p className="text-gray-700 font-medium leading-relaxed mb-8 relative z-10">
                                &quot;{t.content}&quot;
                            </p>
                            <div className="flex items-center space-x-4">
                                <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm" />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{t.author}</h4>
                                    <p className="text-gray-400 font-medium text-xs uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
