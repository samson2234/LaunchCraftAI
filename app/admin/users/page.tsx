import { userRepository } from "@/lib/repositories/user.repository";
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
    MoreHorizontal,
    Shield,
    User as UserIcon,
    Mail,
    Calendar,
    Rocket,
    CreditCard,
    Trash2,
    ShieldCheck
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default async function AdminUsersPage() {
    const users = await userRepository.list();

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">User Management</h1>
                <p className="text-gray-500 font-medium">Manage founder accounts, roles, and platform access.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="font-bold text-gray-900 h-16 px-8">Founder</TableHead>
                            <TableHead className="font-bold text-gray-900 h-16">Status</TableHead>
                            <TableHead className="font-bold text-gray-900 h-16">Plan</TableHead>
                            <TableHead className="font-bold text-gray-900 h-16 text-center">Projects</TableHead>
                            <TableHead className="font-bold text-gray-900 h-16">Joined</TableHead>
                            <TableHead className="h-16 px-8"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-50/30 transition-colors">
                                <TableCell className="px-8 py-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400">
                                            {user.name?.charAt(0) || user.email.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <p className="font-bold text-gray-900">{user.name || "Anonymous"}</p>
                                                {user.role === "ADMIN" && (
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[8px] font-black uppercase tracking-widest px-1.5 py-0 h-4">
                                                        Admin
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Mail className="w-3 h-3 mr-1" />
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-black text-[10px] uppercase tracking-widest">
                                        Active
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        <span className={`text-sm font-black uppercase tracking-wider ${user.subscription?.plan === "GROWTH" ? "text-purple-600" :
                                                user.subscription?.plan === "PRO" ? "text-blue-600" :
                                                    "text-gray-500"
                                            }`}>
                                            {user.subscription?.plan || "FREE"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-50 rounded-lg text-sm font-bold text-gray-700">
                                        {user._count.projects}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm text-gray-500 font-medium flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-2" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </TableCell>
                                <TableCell className="px-8 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-xl">
                                                <MoreHorizontal className="h-5 w-5 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                                            <DropdownMenuLabel className="font-bold text-xs uppercase tracking-widest text-gray-400 px-3 py-2">Account Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="rounded-xl px-3 py-2 font-bold focus:bg-primary/5 focus:text-primary cursor-pointer">
                                                <UserIcon className="mr-2 h-4 w-4" /> View Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl px-3 py-2 font-bold focus:bg-primary/5 focus:text-primary cursor-pointer">
                                                <ShieldCheck className="mr-2 h-4 w-4" /> Manage Permissions
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-gray-100 my-1" />
                                            <DropdownMenuItem className="rounded-xl px-3 py-2 font-bold text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                                                <Trash2 className="mr-2 h-4 w-4" /> Suspend Account
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
