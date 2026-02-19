"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
    const [state, action, isPending] = useActionState(registerUser, undefined);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
            <Card className="w-full max-w-md shadow-xl border-purple-100">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center gradient-text">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="********" required minLength={8} />
                            <p className="text-xs text-muted-foreground">
                                Must contain uppercase, lowercase, number, and min 8 chars.
                            </p>
                        </div>

                        {state?.error && (
                            <div className="text-sm text-red-500 font-medium">
                                {state.error}
                            </div>
                        )}

                        <Button
                            className="w-full bg-primary hover:bg-primary/90 transition-colors"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
