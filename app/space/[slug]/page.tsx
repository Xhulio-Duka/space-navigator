import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SkyImage } from "@/components/sky-image"
import { Unavailable } from "@/components/unavailable"
import { Button } from "@/components/ui/button"
import {
  explanationParagraphs,
  formatApodDate,
  frameSrc,
  getPicture,
  isApodSlug,
  lede,
} from "@/lib/apod"

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getPicture(slug)

  if (result.status !== "ready") {
    return { title: "Picture" }
  }

  return {
    title: result.item.title,
    description: lede(result.item.explanation),
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  if (!isApodSlug(slug)) {
    notFound()
  }

  const result = await getPicture(slug)

  if (result.status === "not-found") {
    notFound()
  }

  if (result.status !== "ready") {
    return <Unavailable reason={result.status} />
  }

  const { item } = result
  const src = frameSrc(item)
  const paragraphs = explanationParagraphs(item.explanation)

  return (
    <article>
      <header className="relative flex min-h-[88svh] items-end bg-black">
        {src ? (
          <SkyImage src={src} alt="" priority sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-neutral-950" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/20" />
        <div className="relative z-10 flex w-full flex-col gap-4 px-6 pt-28 pb-14 md:px-12 md:pb-20">
          <time
            dateTime={item.date}
            className="font-heading text-lg tracking-[0.14em] text-white/80 uppercase"
          >
            {item.mediaType === "video"
              ? `Motion · ${formatApodDate(item.date)}`
              : formatApodDate(item.date)}
          </time>
          <h1 className="max-w-6xl font-heading text-[clamp(3.1rem,8.6vw,7.4rem)] leading-[0.84] font-medium tracking-tight text-balance text-white uppercase">
            {item.title}
          </h1>
        </div>
      </header>
      <div className="grid gap-10 px-6 py-16 md:grid-cols-12 md:px-12 md:py-24">
        <div className="flex flex-col gap-6 md:col-span-4">
          <Link
            href="/space"
            className="w-fit font-heading text-base tracking-[0.12em] text-muted-foreground uppercase hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Archive
          </Link>
          <p className="text-base leading-relaxed text-muted-foreground">
            {item.copyright
              ? `Credit ${item.copyright}`
              : "Credit NASA Astronomy Picture of the Day"}
          </p>
          <div className="flex flex-col items-start gap-3">
            {item.hdurl ? (
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <a href={item.hdurl} target="_blank" rel="noreferrer" />
                }
              >
                High-resolution file
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            ) : null}
            {item.mediaType === "video" ? (
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href={item.url} target="_blank" rel="noreferrer" />}
              >
                Play the source
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-6 md:col-span-7 md:col-start-6">
          <h2 className="font-heading text-base tracking-[0.12em] text-muted-foreground uppercase">
            Explanation
          </h2>
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="text-base leading-relaxed md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  )
}
