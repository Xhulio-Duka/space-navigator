import Link from "next/link"
import { NewsletterForm } from "@/components/newsletter-form"
import { Separator } from "@/components/ui/separator"
import { NAV_LINKS } from "@/lib/navigation"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="flex flex-col gap-8 px-6 py-10 md:px-12 md:py-12">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] leading-[0.92] font-medium tracking-tight uppercase">
              The daily note
            </h2>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Leave an email and the desk is told. Each address can be sent
              once, and only when the server is configured.
            </p>
          </div>
          <NewsletterForm />
        </div>
        <Separator />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-heading text-sm tracking-[0.16em] text-muted-foreground uppercase hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Pictures and explanations are published by NASA as the Astronomy
              Picture of the Day. SpaceNavigator is an independent reader and
              is not part of NASA.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © {year} SpaceNavigator
          </p>
        </div>
      </div>
    </footer>
  )
}
