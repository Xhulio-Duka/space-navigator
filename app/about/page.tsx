import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About",
  description:
    "SpaceNavigator is an independent reading room for NASA's Astronomy Picture of the Day.",
}

export default function AboutPage() {
  return (
    <>
      <section className="flex min-h-svh flex-col justify-end px-6 pt-28 pb-16 md:px-12">
        <p className="font-heading text-[0.7rem] tracking-[0.28em] text-muted-foreground uppercase">
          About
        </p>
        <h1 className="mt-4 max-w-5xl font-heading text-[clamp(3.2rem,8vw,6.75rem)] leading-[0.86] font-medium tracking-tight text-balance uppercase">
          A reading room for the daily sky.
        </h1>
      </section>
      <section className="grid gap-12 border-t border-border px-6 py-20 md:grid-cols-12 md:px-12 md:py-28">
        <h2 className="font-heading text-4xl leading-none tracking-tight uppercase md:col-span-4">
          What this is
        </h2>
        <div className="flex max-w-prose flex-col gap-6 text-base leading-relaxed md:col-span-7 md:col-start-6 md:text-lg">
          <p>
            SpaceNavigator presents NASA&apos;s Astronomy Picture of the Day as
            a sequence you can move through. Each entry is the picture published
            for that date, the title it was given, and the explanation written
            to go with it.
          </p>
          <p>
            The archive keeps a recent window close at hand. The first visit
            asks NASA for the range. Later visits read that cache, so browsing
            stays quick.
          </p>
          <p>
            The project is independent. It is not a NASA site, and it does not
            speak for the people who make the pictures.
          </p>
        </div>
      </section>
      <section className="grid gap-12 border-t border-border px-6 py-20 md:grid-cols-12 md:px-12 md:py-28">
        <h2 className="font-heading text-4xl leading-none tracking-tight uppercase md:col-span-4">
          How a day works
        </h2>
        <div className="flex max-w-prose flex-col gap-6 text-base leading-relaxed md:col-span-7 md:col-start-6 md:text-lg">
          <p>
            The record begins on 16 June 1995. One calendar day, one frame. Some
            days are photographs. Some are short films. When a film has a still,
            that still stands in for the frame, and the source stays a click
            away.
          </p>
          <p>
            Dates that are not real, that fall before the record, or that have
            not been published yet have no page here.
          </p>
          <div>
            <Button render={<Link href="/space" />} nativeButton={false}>
              Browse the archive
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
