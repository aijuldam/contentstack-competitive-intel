import { Skeleton } from "@/components/ui/skeleton";

export default function NarrativeLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-6">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-72" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-lg border border-border p-4 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      ))}
    </div>
  );
}
