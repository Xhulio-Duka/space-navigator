import Link from "next/link"
import { NewsletterForm } from "@/components/newsletter-form"
import { Separator } from "@/components/ui/separator"
import { NAV_LINKS } from "@/lib/navigation"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="flex flex-col gap-12 px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="flex flex-col gap-4 md:col-span-5">
            <h2 className="font-heading text-[clamp(2.4rem,5vw,4rem)] leading-[0.9] font-medium tracking-tight uppercase">
              The daily note
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Leave an email and the desk is told. This app does not keep a
              mailing list. It sends one message through Resend when the server
              is configured.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <NewsletterForm />
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-muted-foreground">
            © {year} SpaceNavigator
          </p>
        </div>
        <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
          Pictures and explanations are published by NASA as the Astronomy
          Picture of the Day. SpaceNavigator is an independent reader and is not
          part of NASA.
        </p>
      </div>
    </footer>
  )
}
