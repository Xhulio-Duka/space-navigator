import Link from "next/link"
import { SkyImage } from "@/components/sky-image"
import { formatApodDate, frameSrc, lede, type ApodItem } from "@/lib/apod"

export function PicturePanel({
  item,
  priority = false,
  kicker,
  showLede = false,
  heading = "h2",
}: {
  item: ApodItem
  priority?: boolean
  kicker?: string
  showLede?: boolean
  heading?: "h1" | "h2"
}) {
  const src = frameSrc(item)
  const Title = heading
  const label =
    item.mediaType === "video"
      ? `Motion · ${kicker ?? formatApodDate(item.date)}`
      : (kicker ?? formatApodDate(item.date))

  const frame = showLede
    ? "h-[clamp(28rem,72svh,40rem)]"
    : "h-[clamp(18rem,48svh,28rem)]"

  return (
    <article
      className={`relative overflow-hidden bg-black ${frame} min-h-screen`}
    >
      <Link
        href={`/space/${item.date}`}
        className="group relative flex h-full items-end focus-visible:outline-2 focus-visible:outline-offset-[-10px] focus-visible:outline-white"
      >
        {src ? (
          <SkyImage
            src={src}
            alt=""
            priority={priority}
            sizes="100vw"
            className="object-cover motion-safe:transition motion-safe:duration-700 motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-950" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/45 to-black/25" />
        <div className="relative z-10 flex w-full flex-col gap-3 px-6 pt-20 pb-8 md:px-12 md:pb-10">
          <p className="font-heading text-base tracking-[0.14em] text-white/80 uppercase">
            {label}
          </p>
          <Title className="max-w-5xl font-heading text-[clamp(2.15rem,5vw,4.25rem)] leading-[0.88] font-medium tracking-tight text-balance text-white uppercase">
            {item.title}
          </Title>
          {showLede ? (
            <p className="max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              {lede(item.explanation)}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  )
}
