import { ProjectSkeleton } from "@/components/loading-skeletons";

export default function Loading() {
    return (
        <div className="space-y-8">
            <div>
                <div className="h-10 w-48 bg-gray-200 rounded-md animate-pulse mb-2" />
                <div className="h-6 w-96 bg-gray-100 rounded-md animate-pulse" />
            </div>
            <ProjectSkeleton />
        </div>
    );
}
