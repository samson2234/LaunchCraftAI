import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Platform Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900">LaunchCraft AI</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 font-bold text-gray-500">
                        <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
                        <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
                        <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/login">
                            <Button variant="ghost" className="font-bold text-gray-600">Sign In</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="font-bold shadow-lg shadow-primary/20 px-6">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                <Hero />

                <div id="features">
                    <Features />
                </div>

                <Pricing />

                <Testimonials />

                <div id="faq">
                    <FAQ />
                </div>

                {/* Final CTA Section */}
                <section className="py-32 px-6">
                    <div className="container mx-auto">
                        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full text-sm font-bold text-primary mb-8">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Stop Planning, Start Launching</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter max-w-3xl mx-auto leading-[1.1]">
                                    The future of your startup <br /> begins with a single click.
                                </h2>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link href="/register">
                                        <Button size="lg" className="h-14 px-12 text-lg font-bold shadow-xl shadow-primary/20 group">
                                            Initialize Dashboard
                                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <span className="text-gray-500 font-medium">Free 14-day trial for Pro features</span>
                                </div>
                            </div>
                            {/* Decorative radial gradients */}
                            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
                        </div>
                    </div>
                </section>
            </main>

            {/* Modern Footer */}
            <footer className="py-20 border-t border-gray-100 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center space-x-2 mb-6 text-gray-900">
                                <Rocket className="w-8 h-8 text-primary" />
                                <span className="text-xl font-black tracking-tight">LaunchCraft AI</span>
                            </div>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Helping non-technical founders build, validate, and scale their startup visions with AI.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                            <Link href="#features" className="block text-gray-500 hover:text-primary transition-colors font-medium">Platform</Link>
                            <Link href="#pricing" className="block text-gray-500 hover:text-primary transition-colors font-medium">Pricing</Link>
                            <Link href="/dashboard" className="block text-gray-500 hover:text-primary transition-colors font-medium">Dashboard</Link>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                            <Link href="#" className="block text-gray-500 hover:text-primary transition-colors font-medium">About Us</Link>
                            <Link href="#" className="block text-gray-500 hover:text-primary transition-colors font-medium">Terms</Link>
                            <Link href="#" className="block text-gray-500 hover:text-primary transition-colors font-medium">Privacy</Link>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 mb-6">Community</h4>
                            <Link href="#" className="block text-gray-500 hover:text-primary transition-colors font-medium">Support</Link>
                            <Link href="#" className="block text-gray-500 hover:text-primary transition-colors font-medium">X (Twitter)</Link>
                            <Link href="#" className="block text-gray-500 hover:text-primary transition-colors font-medium">LinkedIn</Link>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-50 text-center">
                        <p className="text-gray-400 font-medium">© 2026 LaunchCraft AI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
