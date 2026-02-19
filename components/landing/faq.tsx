"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "Do I need technical skills to use LaunchCraft AI?",
        answer: "Absolutely not. LaunchCraft is designed specifically for non-technical founders. Our AI handles the heavy lifting—from drafting professional copy to structuring your business plan.",
    },
    {
        question: "How accurate is the AI-generated content?",
        answer: "Our models are tuned for startup success patterns. While the content is highly professional and relevant, we recommend a quick review to ensure it perfectly matches your unique vision.",
    },
    {
        question: "Can I use my own custom domain for landing pages?",
        answer: "Yes! Pro and Growth plan users can connect their own custom domains to any project they create, giving your startup a fully professional look.",
    },
    {
        question: "What happens to my data if I cancel?",
        answer: "You own all your data. If you cancel, your projects will be archived, and you can export your leads at any time before your subscription period ends.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-32 bg-gray-50/50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Got <span className="gradient-text">Questions?</span>
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-500 font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Everything you need to know about getting your startup off the ground.
                    </motion.p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-bold text-gray-900">{faq.question}</span>
                                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary transition-all">
                                    {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="p-6 pt-0 text-gray-600 font-medium leading-relaxed border-t border-gray-50 mt-2">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
