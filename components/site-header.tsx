"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { MenuIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NAV_LINKS } from "@/lib/navigation"
import { cn } from "@/lib/utils"

function isCurrent(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex h-12 items-center justify-between gap-3 px-4 md:px-8">
        <Link
          href="/"
          className="font-heading text-[0.95rem] tracking-[0.18em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          SpaceNavigator
        </Link>
        <div className="flex items-center gap-1 md:gap-6">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 md:flex"
          >
            {NAV_LINKS.map((link) => {
              const current = isCurrent(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "font-heading text-sm tracking-[0.16em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                    current
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-heading tracking-[0.16em] uppercase">
                  SpaceNavigator
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Primary pages
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-2 px-4">
                {NAV_LINKS.map((link) => {
                  const current = isCurrent(pathname, link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "font-heading text-4xl leading-none tracking-tight uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                        current ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
