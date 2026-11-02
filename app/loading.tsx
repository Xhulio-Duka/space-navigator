import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="relative h-[clamp(28rem,72svh,40rem)]"
    >
      <span className="sr-only">Loading the latest picture</span>
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-6 pb-16 md:px-12">
        <Skeleton className="h-3 w-48 rounded-none bg-background/40" />
        <Skeleton className="h-20 w-full max-w-3xl rounded-none bg-background/50" />
        <Skeleton className="h-20 w-2/3 max-w-xl rounded-none bg-background/50" />
        <Skeleton className="h-4 w-full max-w-md rounded-none bg-background/40" />
      </div>
    </div>
  )
}
