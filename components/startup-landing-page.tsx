"use client";

import { motion } from "framer-motion";
import {
    Rocket,
    Zap,
    Users,
    Globe,
    Shield,
    Sparkles,
    Check,
    Star,
    ArrowRight,
    Plus,
    Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface PublicLandingPageProps {
    project: any;
}

interface Feature {
    icon: any;
    title: string;
    desc: string;
}

interface PriceTier {
    name: string;
    price: string;
    features: string[];
    popular?: boolean;
}

interface FAQItem {
    q: string;
    a: string;
}

interface Testimonial {
    name: string;
    role: string;
    text: string;
    image: string;
}

export default function StartupLandingPage({ project }: PublicLandingPageProps) {
    const lp = project.landingPage;
    const content = lp?.content || {};
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Dynamic content from AI or Defaults
    const features: Feature[] = content.features || [
        { icon: Zap, title: "Lightning Fast", desc: "Experience unprecedented speed and efficiency with our solution." },
        { icon: Shield, title: "Secure by Default", desc: "Your data is protected with enterprise-grade encryption." },
        { icon: Globe, title: "Global Reach", desc: "Connect with users around the world effortlessly." }
    ];

    const pricing: PriceTier[] = content.pricing || [
        { name: "Starter", price: "0", features: ["Basic access", "Standard support", "Community access"] },
        { name: "Pro", price: "29", features: ["Full access", "Priority support", "Advanced metrics"], popular: true },
        { name: "Enterprise", price: "Custom", features: ["Unlimited everything", "Dedicated manager", "SLA guarantee"] }
    ];

    const faqs: FAQItem[] = content.faq || [
        { q: "How do I get started?", a: "Simply enter your email address in the waitlist form above and we will keep you updated." },
        { q: "Is it really free?", a: "We offer a free starter plan and more advanced tiers for growing needs." },
        { q: "When will you launch?", a: "We are currently in private beta and plan to launch publicly very soon!" }
    ];

    const testimonials: Testimonial[] = content.testimonials || [
        { name: "John Doe", role: "Founder @ Alpha", text: "LaunchCraft AI helped us validate our idea in record time. The interface is stunning and easy to use.", image: "https://i.pravatar.cc/150?u=1" },
        { name: "Jane Smith", role: "Product Manager", text: "Incredible attention to detail. This landing page alone increased our conversion rate by 40%.", image: "https://i.pravatar.cc/150?u=2" }
    ];

    async function handleSubmit() {
        if (!email) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId: project.id,
                    email,
                    name: "Waitlist User",
                    status: "NEW",
                }),
            });
            if (res.ok) {
                setSuccess(true);
                setEmail("");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    if (content.rawCode) {
        return (
            <div className="fixed inset-0 w-screen h-screen bg-white">
                <iframe
                    srcDoc={content.rawCode}
                    className="w-full h-full border-none"
                    title={project.name}
                />

                {/* Floating Feedback/Admin Link for Project Owner (optional, but good for UX) */}
                <div className="fixed bottom-6 right-6 z-50">
                    <Button variant="outline" className="rounded-full shadow-2xl bg-white/80 backdrop-blur-md font-bold" asChild>
                        <a href={`/dashboard/projects/${project.id}`}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Back to Studio
                        </a>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white">
            {/* Navigation */}
            <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Rocket className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold tracking-tight">{project.name}</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-500">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                        <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
                    </div>
                    <Button className="font-bold">Get Started</Button>
                </div>
            </nav>

            <main>
                {/* Animated Hero Section */}
                <section className="relative py-24 px-6 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,112,243,0.05),transparent_50%)]" />
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center space-x-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-bold mb-8"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Launching Soon</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-[1.1]"
                        >
                            {lp?.title || project.name}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed"
                        >
                            {lp?.subtitle || project.description || "The future of startup building is here. Join the waitlist to be the first to know when we launch."}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="max-w-lg mx-auto border-none shadow-2xl rounded-[2rem] overflow-hidden ring-1 ring-gray-100 p-1 bg-gradient-to-br from-primary/10 to-transparent">
                                <CardContent className="bg-white rounded-[1.8rem] p-8">
                                    <h3 className="text-xl font-bold mb-6">Join the exclusive waitlist</h3>
                                    {success ? (
                                        <div className="py-4 text-emerald-600 font-bold flex items-center justify-center space-x-2">
                                            <Check className="w-6 h-6" />
                                            <span>You&apos;re on the list! We&apos;ll be in touch.</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Input
                                                type="email"
                                                placeholder="Enter your email..."
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-primary focus:border-primary"
                                                disabled={submitting}
                                            />
                                            <Button
                                                size="lg"
                                                className="font-bold h-12 px-8 shadow-xl shadow-primary/20"
                                                onClick={handleSubmit}
                                                disabled={submitting}
                                            >
                                                {submitting ? "Joining..." : "Get Access"}
                                            </Button>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-400 mt-4 font-medium italic">
                                        Join 1,200+ others already on the waitlist.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-gray-50/50 border-y border-gray-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black mb-4">Core Features</h2>
                            <p className="text-gray-500 font-medium">Why founders choose {project.name}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {features.map((f: Feature, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="space-y-4 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                        {f.icon && typeof f.icon !== 'string' ? <f.icon className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
                                    </div>
                                    <h3 className="text-xl font-bold">{f.title}</h3>
                                    <p className="text-gray-500 leading-relaxed font-medium">
                                        {f.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Animated Pricing Section */}
                <section id="pricing" className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black mb-4">Simple Pricing</h2>
                            <p className="text-gray-500 font-medium">No hidden fees, cancel anytime</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {pricing.map((p: PriceTier, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-8 rounded-3xl border ${p.popular ? 'border-primary ring-1 ring-primary shadow-xl bg-white' : 'border-gray-100 bg-gray-50/50'} flex flex-col`}
                                >
                                    <h4 className="text-lg font-bold mb-2">{p.name}</h4>
                                    <div className="flex items-baseline mb-6">
                                        <span className="text-4xl font-black">${p.price}</span>
                                        {p.price !== 'Custom' && <span className="text-gray-500 font-bold ml-1">/mo</span>}
                                    </div>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {p.features.map((f: string, j: number) => (
                                            <li key={j} className="flex items-center text-sm font-medium text-gray-600">
                                                <Check className="w-4 h-4 text-emerald-500 mr-2" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button variant={p.popular ? 'default' : 'outline'} className="w-full font-bold h-12">
                                        Choose Plan
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-24 bg-gray-900 text-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-black mb-16 text-center italic">&quot;The most impressive startup builder I&apos;ve ever used.&quot;</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {testimonials.map((t: Testimonial, i: number) => (
                                <div key={i} className="flex items-start space-x-6">
                                    <img src={t.image} className="w-16 h-16 rounded-full grayscale border-2 border-white/10" alt={t.name} />
                                    <div>
                                        <div className="flex text-amber-400 mb-2">
                                            <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                                        </div>
                                        <p className="text-white/80 font-medium leading-relaxed mb-4 italic">
                                            &quot;{t.text}&quot;
                                        </p>
                                        <h4 className="font-bold">{t.name}</h4>
                                        <p className="text-white/40 text-sm">{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-24 bg-white">
                    <div className="max-w-3xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black mb-4">FAQ</h2>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq: FAQItem, i: number) => (
                                <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full text-left p-6 flex items-center justify-between font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                                    >
                                        {faq.q}
                                        {openFaq === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </button>
                                    {openFaq === i && (
                                        <div className="p-6 pt-0 text-gray-500 font-medium border-t border-gray-50 bg-gray-50/20">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-6 text-center">
                    <h2 className="text-4xl font-black mb-8 italic tracking-tight">Ready to join the revolution?</h2>
                    <Button size="lg" className="h-14 px-12 text-lg font-bold shadow-xl shadow-primary/20">
                        Register Interest Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </section>
            </main>

            <footer className="py-12 border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-gray-400 font-medium">© 2026 {project.name}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
