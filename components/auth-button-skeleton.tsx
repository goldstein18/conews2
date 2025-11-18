import { Skeleton } from "@/components/ui/skeleton";

export function AuthButtonSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-9 w-16" /> {/* Sign In button */}
      <Skeleton className="h-9 w-16" /> {/* Sign Up button */}
    </div>
  );
}

export function AuthButtonSkeletonLarge() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Skeleton className="h-11 min-w-[200px]" /> {/* Primary button */}
      <Skeleton className="h-11 min-w-[200px]" /> {/* Secondary button */}
    </div>
  );
}