"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Rocket,
    Settings,
    Users,
    FileText,
    Presentation,
    CheckCircle,
    CreditCard,
    LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: Rocket },
    { name: "Leads", href: "/dashboard/leads", icon: Users },
    { name: "Idea Validation", href: "/dashboard/validation", icon: CheckCircle },
    { name: "Pitch Decks", href: "/dashboard/pitch-deck", icon: Presentation },
    { name: "Business Plans", href: "/dashboard/business-plan", icon: FileText },
    { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 fixed left-0 top-0 bottom-0 z-50">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold gradient-text">LaunchCraft</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                            )} />
                            <span>{item.name}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="active-nav"
                                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
