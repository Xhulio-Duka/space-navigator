import { Empty, EmptyDescription, EmptyHeader } from "@/components/ui/empty"

const COPY = {
  "missing-key": {
    kicker: "Configuration",
    title: "The sky is not connected.",
    description:
      "NASA_API_KEY is missing on the server. Add a key and reload. The rest of the site stays up.",
  },
  unavailable: {
    kicker: "Feed",
    title: "The picture service did not answer.",
    description:
      "NASA's Astronomy Picture of the Day could not be reached. This page is intact. Try the request again in a moment.",
  },
} as const

export function Unavailable({
  reason,
}: {
  reason: "missing-key" | "unavailable"
}) {
  const copy = COPY[reason]

  return (
    <section className="flex min-h-svh flex-col justify-end px-6 pt-24 pb-16 md:px-12">
      <p className="font-heading text-lg tracking-[0.14em] text-muted-foreground uppercase">
        {copy.kicker}
      </p>
      <h1 className="mt-4 max-w-4xl font-heading text-[clamp(3rem,8vw,6.25rem)] leading-[0.86] font-medium tracking-tight text-balance uppercase">
        {copy.title}
      </h1>
      <Empty className="mt-10 max-w-xl items-start rounded-none border-border bg-transparent p-0 text-left">
        <EmptyHeader className="items-start text-left">
          <EmptyDescription className="text-base text-muted-foreground">
            {copy.description}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </section>
  )
}
