import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-svh flex-col justify-end gap-5 px-6 pb-16 md:px-12"
    >
      <span className="sr-only">Loading about</span>
      <Skeleton className="h-3 w-20 rounded-none" />
      <Skeleton className="h-24 w-full max-w-4xl rounded-none" />
      <Skeleton className="h-24 w-4/5 max-w-3xl rounded-none" />
    </div>
  )
}
