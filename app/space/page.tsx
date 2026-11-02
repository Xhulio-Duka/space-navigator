import type { Metadata } from "next"
import Link from "next/link"
import { SkyImage } from "@/components/sky-image"
import { Unavailable } from "@/components/unavailable"
import { formatApodDate, frameSrc, getArchive } from "@/lib/apod"

export const metadata: Metadata = {
  title: "Space",
  description:
    "A cached window of recent Astronomy Pictures of the Day, newest first.",
}

export default async function SpacePage() {
  const result = await getArchive()

  if (result.status !== "ready") {
    return <Unavailable reason={result.status} />
  }

  return (
    <div className="px-6 pt-24 pb-20 md:px-12">
      <p className="font-heading text-lg tracking-[0.14em] text-muted-foreground uppercase">
        Space
      </p>
      <h1 className="mt-4 max-w-4xl font-heading text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.86] font-medium tracking-tight uppercase">
        Recent sky
      </h1>
      <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
        {result.items.length} recent pictures, newest first. The window is
        cached so the archive opens without asking NASA again on every visit.
      </p>
      <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((item) => {
          const src = frameSrc(item)
          return (
            <li key={item.date}>
              <Link
                href={`/space/${item.date}`}
                className="group flex flex-col gap-4 focus-visible:outline-none"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {src ? (
                    <SkyImage
                      src={src}
                      alt=""
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover motion-safe:transition motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted" />
                  )}
                  <span className="pointer-events-none absolute inset-0 group-focus-visible:ring-2 group-focus-visible:ring-foreground group-focus-visible:ring-inset" />
                </div>
                <div className="flex flex-col gap-2">
                  <time
                    dateTime={item.date}
                    className="font-heading text-base tracking-[0.12em] text-muted-foreground uppercase"
                  >
                    {item.mediaType === "video"
                      ? `Motion · ${formatApodDate(item.date)}`
                      : formatApodDate(item.date)}
                  </time>
                  <h2 className="font-heading text-3xl leading-none tracking-tight uppercase group-hover:underline">
                    {item.title}
                  </h2>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
