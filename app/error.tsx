"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="flex min-h-svh flex-col justify-end px-6 pt-24 pb-16 md:px-12">
      <p className="font-heading text-lg tracking-[0.14em] text-muted-foreground uppercase">
        Error
      </p>
      <h1 className="mt-4 max-w-4xl font-heading text-[clamp(3rem,8vw,6.25rem)] leading-[0.86] font-medium tracking-tight text-balance uppercase">
        This view failed to load.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
        The page hit an unexpected fault. You can try the render again, or
        return to the latest picture.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-sm text-muted-foreground">
          Reference {error.digest}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button
          variant="outline"
          render={<Link href="/" />}
          nativeButton={false}
        >
          Home
        </Button>
      </div>
    </section>
  )
}
