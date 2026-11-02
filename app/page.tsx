import Link from "next/link"
import { PicturePanel } from "@/components/picture-panel"
import { Unavailable } from "@/components/unavailable"
import { Button } from "@/components/ui/button"
import { formatApodDate, getHomePictures } from "@/lib/apod"

export default async function HomePage() {
  const result = await getHomePictures()

  if (result.status !== "ready") {
    return <Unavailable reason={result.status} />
  }

  const [latest, ...recent] = result.items
  if (!latest) {
    return <Unavailable reason="unavailable" />
  }

  return (
    <>
      <PicturePanel
        item={latest}
        priority
        heading="h1"
        showLede
        kicker={`Picture of the day · ${formatApodDate(latest.date)}`}
      />
      {recent.map((item) => (
        <PicturePanel key={item.date} item={item} />
      ))}
      <section className="flex flex-col px-6 py-14 md:px-12 md:py-16">
        <p className="font-heading text-lg tracking-[0.14em] text-muted-foreground uppercase">
          SpaceNavigator
        </p>
        <h2 className="mt-4 max-w-4xl font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.88] font-medium tracking-tight uppercase">
          One frame.
          <br />
          Every day.
          <br />
          Since 1995.
        </h2>
        <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
          NASA publishes a single astronomy picture each day, with a plain
          explanation of what you are seeing. SpaceNavigator is an independent
          reading room for that sequence: the newest frame first, then the days
          just behind it.
        </p>
        <div className="mt-8">
          <Button render={<Link href="/space" />} nativeButton={false}>
            Open the archive
          </Button>
        </div>
      </section>
    </>
  )
}
