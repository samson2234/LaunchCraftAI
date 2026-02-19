import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { ShieldAlert } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Admin Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0 bg-gray-900 text-white">
                <div className="p-6 flex items-center space-x-3 border-b border-gray-800">
                    <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                        <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">ADMIN PANEL</span>
                </div>
                <div className="p-4">
                    <Sidebar />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader
                    userName={session.user.name}
                    userEmail={session.user.email}
                    userImage={session.user.image}
                />

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
