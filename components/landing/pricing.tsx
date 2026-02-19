"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, Rocket, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Free",
        price: "0",
        description: "Perfect for testing your first idea",
        features: ["1 Project", "5 AI Generations / mo", "Basic Landing Page", "50 Leads / project", "Standard Support"],
        icon: Rocket,
        color: "gray",
    },
    {
        name: "Pro",
        price: "29",
        description: "Everything you need to scale fast",
        features: ["5 Projects", "50 AI Generations / mo", "Custom Landing Pages", "500 Leads / project", "Pitch Deck Generation", "Priority Support"],
        icon: Zap,
        color: "primary",
        popular: true,
    },
    {
        name: "Growth",
        price: "99",
        description: "Unlimited power for high-growth teams",
        features: ["Unlimited Projects", "Unlimited AI Generations", "White-label Pages", "Unlimited Leads", "Business Plan Builder", "24/7 VIP Support"],
        icon: Star,
        color: "purple",
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-32 bg-gray-50/50 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Simple, Transparent <span className="gradient-text">Pricing</span>
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-500 font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Start for free and scale as you grow. No hidden fees, cancel anytime.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2",
                                plan.popular && "ring-2 ring-primary scale-105 z-10"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
                                    plan.name === "Free" ? "bg-gray-100 text-gray-500" :
                                        plan.name === "Pro" ? "bg-primary/10 text-primary" : "bg-purple-100 text-purple-600"
                                )}>
                                    <plan.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-black">${plan.price}</span>
                                    <span className="text-gray-500 font-bold ml-2">/month</span>
                                </div>
                                <p className="text-gray-500 mt-4 font-medium h-12 line-clamp-2">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center space-x-3">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-emerald-600" />
                                        </div>
                                        <span className="text-sm text-gray-600 font-semibold">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                size="lg"
                                className={cn(
                                    "w-full h-12 font-bold transition-all",
                                    plan.popular ? "shadow-lg shadow-primary/20" : "border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                {plan.name === "Free" ? "Start Building" : "Get Started"}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
