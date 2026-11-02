import { Skeleton } from "@/components/ui/skeleton"

export default function ArticleLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading this picture</span>
      <div className="relative min-h-[88svh]">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-6 pb-16 md:px-12">
          <Skeleton className="h-3 w-40 rounded-none bg-background/40" />
          <Skeleton className="h-20 w-full max-w-3xl rounded-none bg-background/50" />
        </div>
      </div>
      <div className="grid gap-10 px-6 py-16 md:grid-cols-12 md:px-12">
        <div className="flex flex-col gap-4 md:col-span-4">
          <Skeleton className="h-3 w-24 rounded-none" />
          <Skeleton className="h-4 w-40 rounded-none" />
        </div>
        <div className="flex flex-col gap-4 md:col-span-7 md:col-start-6">
          <Skeleton className="h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-4/5 rounded-none" />
        </div>
      </div>
    </div>
  )
}
