"use client";

import { Bell, Search, User, Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface DashboardHeaderProps {
    userName?: string | null;
    userEmail?: string | null;
    userImage?: string | null;
}

export function DashboardHeader({ userName, userEmail, userImage }: DashboardHeaderProps) {
    return (
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center flex-1">
                <div className="relative w-96 max-w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative text-gray-500">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 h-10 w-10 rounded-full border border-gray-200 overflow-hidden ring-offset-2 hover:ring-2 ring-primary/20 transition-all">
                            {userImage ? (
                                <img src={userImage} alt={userName || "User"} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                                </div>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{userName || "User"}</p>
                                <p className="text-xs leading-none text-muted-foreground">{userEmail || ""}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a href="/dashboard/settings" className="cursor-pointer">Profile Settings</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href="/dashboard/subscription" className="cursor-pointer">Subscription</a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
