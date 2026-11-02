import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col justify-end px-6 pt-24 pb-16 md:px-12">
      <p className="font-heading text-[0.7rem] tracking-[0.28em] text-muted-foreground uppercase">
        404
      </p>
      <h1 className="mt-4 max-w-4xl font-heading text-[clamp(3rem,8vw,6.5rem)] leading-[0.86] font-medium tracking-tight text-balance uppercase">
        No picture for that date.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
        The record begins on 16 June 1995. Dates outside it, and addresses that
        are not a day, do not have an entry.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button render={<Link href="/space" />} nativeButton={false}>
          Browse the archive
        </Button>
        <Button
          variant="outline"
          render={<Link href="/" />}
          nativeButton={false}
        >
          Latest picture
        </Button>
      </div>
    </section>
  )
}
