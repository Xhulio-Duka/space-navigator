import Image from "next/image"
import { cn } from "@/lib/utils"

const OPTIMIZED_HOSTS = new Set([
  "apod.nasa.gov",
  "www.nasa.gov",
  "images-assets.nasa.gov",
  "img.youtube.com",
  "i.ytimg.com",
  "photojournal.jpl.nasa.gov",
  "science.nasa.gov",
  "assets.science.nasa.gov",
])

export function SkyImage({
  src,
  alt,
  priority = false,
  sizes,
  className,
}: {
  src: string
  alt: string
  priority?: boolean
  sizes: string
  className?: string
}) {
  let host = ""
  try {
    const url = new URL(src)
    host = url.protocol === "https:" ? url.hostname : ""
  } catch {
    host = ""
  }

  if (!OPTIMIZED_HOSTS.has(host)) {
    return (
      // NASA occasionally hosts a frame outside the optimized allow-list.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", className)}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  )
}
