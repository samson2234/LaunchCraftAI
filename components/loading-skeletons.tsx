import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProjectSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-none shadow-sm h-64">
                    <CardHeader className="pb-4">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-2xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
                <Skeleton className="h-96 rounded-2xl" />
            </div>
        </div>
    )
}
