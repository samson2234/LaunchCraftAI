import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Rocket,
    CreditCard,
    TrendingUp,
    ChevronRight,
    Star,
    Globe,
    Zap
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
    // Fetch stats
    const [userCount, projectCount, leadCount, activeSubs] = await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.lead.count(),
        prisma.subscription.count({ where: { status: "ACTIVE" } }),
    ]);

    // Fetch recent activity
    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { subscription: true }
    });

    const recentProjects = await prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true }
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Admin Overview Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Overview</h1>
                <p className="text-gray-500 font-medium">Global platform statistics and management center.</p>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Users", value: userCount, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                    { title: "Total Projects", value: projectCount, icon: Rocket, color: "text-purple-500", bg: "bg-purple-50" },
                    { title: "Total Leads", value: leadCount, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { title: "Active Subs", value: activeSubs, icon: CreditCard, color: "text-amber-500", bg: "bg-amber-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardContent className="p-6 flex items-center space-x-4">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users Section */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Recent Users</CardTitle>
                            <CardDescription>Latest founder signups</CardDescription>
                        </div>
                        <Link href="/admin/users">
                            <Button variant="ghost" size="sm" className="font-bold text-primary">Manage Users</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-50">
                            {recentUsers.map((user) => (
                                <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400">
                                            {user.name?.charAt(0) || user.email.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{user.name || "Anonymous User"}</h4>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${user.subscription?.plan === "GROWTH" ? "bg-purple-100 text-purple-600" :
                                        user.subscription?.plan === "PRO" ? "bg-blue-100 text-blue-600" :
                                            "bg-gray-100 text-gray-600"
                                        }`}>
                                        {user.subscription?.plan || "FREE"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Breakdown */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Revenue Breakdown</CardTitle>
                            <CardDescription>Subscription plan distribution</CardDescription>
                        </div>
                        <Link href="/admin/subscriptions">
                            <Button variant="ghost" size="sm" className="font-bold text-primary">View Revenue</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            {[
                                { label: "Growth Plan ($99/mo)", count: await prisma.subscription.count({ where: { plan: "GROWTH", status: "ACTIVE" } }), color: "bg-purple-500" },
                                { label: "Pro Plan ($29/mo)", count: await prisma.subscription.count({ where: { plan: "PRO", status: "ACTIVE" } }), color: "bg-blue-500" },
                                { label: "Free Plan", count: await prisma.subscription.count({ where: { plan: "FREE" } }), color: "bg-gray-300" },
                            ].map((row, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-gray-600">{row.label}</span>
                                        <span className="text-gray-900">{row.count} users</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`${row.color} h-full rounded-full`}
                                            style={{ width: `${Math.min(100, (row.count / userCount) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                            <p className="text-xs font-black uppercase tracking-widest text-primary/60 mb-1">Estimated MRR</p>
                            <h3 className="text-3xl font-black text-primary">
                                ${((await prisma.subscription.count({ where: { plan: "GROWTH", status: "ACTIVE" } }) * 99) + (await prisma.subscription.count({ where: { plan: "PRO", status: "ACTIVE" } }) * 29)).toLocaleString()}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick System Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900 text-white border-none shadow-xl">
                    <CardContent className="p-8 space-y-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold">Maintenance Mode</h3>
                        <p className="text-gray-400 text-sm">Put the entire system into read-only mode for updates.</p>
                        <Button className="w-full bg-white text-gray-900 hover:bg-white/90 font-bold">Activate Now</Button>
                    </CardContent>
                </Card>
                <Card className="bg-primary text-white border-none shadow-xl">
                    <CardContent className="p-8 space-y-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold">Featured Projects</h3>
                        <p className="text-white/70 text-sm">Select high-quality projects to feature on the homepage.</p>
                        <Button variant="secondary" className="w-full font-bold">Selection Tool</Button>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-gray-100 shadow-sm">
                    <CardContent className="p-8 space-y-4 text-gray-900">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                            <Globe className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Public Status</h3>
                        <p className="text-gray-500 text-sm font-medium">Review pending project requests for public publishing.</p>
                        <Button variant="outline" className="w-full font-bold border-gray-200">Review Queue</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
