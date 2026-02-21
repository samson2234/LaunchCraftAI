import { subscriptionRepository } from "@/lib/repositories/subscription.repository";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CreditCard,
    User,
    Calendar,
    DollarSign,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Clock
} from "lucide-react";

export default async function AdminSubscriptionsPage() {
    const subscriptions = await subscriptionRepository.list();

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Revenue & Subscriptions</h1>
                    <p className="text-gray-500 font-medium">Monitor active plans, billing status, and platform revenue.</p>
                </div>
                <Button className="h-12 px-6 font-bold shadow-lg shadow-primary/20 rounded-2xl">
                    <RefreshCw className="mr-2 h-4 w-4" /> Sync with Stripe
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Subs", value: subscriptions.filter(s => s.status === "ACTIVE").length, icon: CheckCircle2, color: "text-emerald-500" },
                    { label: "Monthly Revenue", value: `$${(subscriptions.filter(s => s.status === "ACTIVE").length * 29).toLocaleString()}`, icon: DollarSign, color: "text-primary" },
                    { label: "Churn Rate", value: "2.4%", icon: AlertCircle, color: "text-amber-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="font-bold text-gray-900 h-16 px-8">Customer</TableHead>
                            <TableHead className="font-bold text-gray-900 h-16">Plan</TableHead>
                            <TableHead className="font-bold text-gray-900 h-16">Status</TableHead>
                            <TableHead className="font-bold text-gray-900 h-16">Renews</TableHead>
                            <TableHead className="font-bold text-gray-900 h-16 px-8">Stripe ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.map((sub) => (
                            <TableRow key={sub.id} className="hover:bg-gray-50/30 transition-colors">
                                <TableCell className="px-8 py-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-9 h-9 bg-primary/5 rounded-lg flex items-center justify-center text-primary font-bold text-xs uppercase">
                                            {sub.user.email.charAt(0)}
                                        </div>
                                        <p className="font-bold text-gray-900">{sub.user.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`font-black tracking-tighter ${sub.plan === "GROWTH" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" :
                                            sub.plan === "PRO" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                                                "bg-gray-100 text-gray-600 hover:bg-gray-100"
                                        } border-none`}>
                                        {sub.plan}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${sub.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"}`} />
                                        <span className="text-sm font-bold text-gray-700">{sub.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm text-gray-500 font-medium flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-2" />
                                        {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "N/A"}
                                    </p>
                                </TableCell>
                                <TableCell className="px-8 font-mono text-xs text-gray-400">
                                    {sub.stripeSubscriptionId || "Local Override"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
