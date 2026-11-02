"use client"

import { Barlow_Condensed, Geist } from "next/font/google"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import "./globals.css"

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
})

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className={cn("dark", sans.variable, display.variable)}>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <main className="flex min-h-svh flex-col justify-end px-6 pb-16 md:px-12">
          <p className="font-heading text-lg tracking-[0.14em] text-muted-foreground uppercase">
            Fault
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-[clamp(3rem,8vw,6rem)] leading-[0.86] font-medium tracking-tight text-balance uppercase">
            The whole site failed to load.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            This is the root error screen. Retry the render, or come back in a
            moment.
          </p>
          <div className="mt-8">
            <Button type="button" onClick={() => reset()}>
              Try again
            </Button>
          </div>
        </main>
      </body>
    </html>
  )
}
