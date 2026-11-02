import { Skeleton } from "@/components/ui/skeleton"

export default function SpaceLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="px-6 pt-24 pb-20 md:px-12"
    >
      <span className="sr-only">Loading the archive</span>
      <Skeleton className="h-3 w-24 rounded-none" />
      <Skeleton className="mt-5 h-20 w-full max-w-xl rounded-none" />
      <Skeleton className="mt-6 h-4 w-full max-w-md rounded-none" />
      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex flex-col gap-4">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <Skeleton className="h-3 w-32 rounded-none" />
            <Skeleton className="h-8 w-4/5 rounded-none" />
          </div>
        ))}
      </div>
    </div>
  )
}
