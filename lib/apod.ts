import https from "node:https"
import { unstable_cache } from "next/cache"
import { connection } from "next/server"

const APOD_ENDPOINT = "https://api.nasa.gov/planetary/apod"
const APOD_EPOCH = "1995-06-16"
const ARCHIVE_DAYS = 40
const HOME_COUNT = 4

export type ApodMedia = "image" | "video" | "other"

export type ApodItem = {
  date: string
  title: string
  explanation: string
  url: string
  hdurl?: string
  mediaType: ApodMedia
  thumbnailUrl?: string
  copyright?: string
}

export type ApodCollection =
  | { status: "ready"; items: ApodItem[] }
  | { status: "missing-key" }
  | { status: "unavailable" }

export type ApodSingle =
  | { status: "ready"; item: ApodItem }
  | { status: "missing-key" }
  | { status: "not-found" }
  | { status: "unavailable" }

class ApodNotFound extends Error {
  constructor(message = "APOD_NOT_FOUND") {
    super(message)
    this.name = "ApodNotFound"
  }
}

const longDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

export function formatApodDate(isoDate: string) {
  const year = Number(isoDate.slice(0, 4))
  const month = Number(isoDate.slice(5, 7))
  const day = Number(isoDate.slice(8, 10))
  return longDate.format(new Date(Date.UTC(year, month - 1, day)))
}

export function isApodSlug(slug: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slug)) {
    return false
  }

  const year = Number(slug.slice(0, 4))
  const month = Number(slug.slice(5, 7))
  const day = Number(slug.slice(8, 10))
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return false
  }

  return slug >= APOD_EPOCH && slug <= utcISO()
}

export function frameSrc(item: ApodItem) {
  if (item.mediaType === "video") {
    return item.thumbnailUrl ?? null
  }

  return item.url || item.thumbnailUrl || null
}

export function lede(text: string, max = 220) {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (normalized.length <= max) {
    return normalized
  }

  const slice = normalized.slice(0, max)
  const sentence = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("."))
  if (sentence > 80) {
    return slice.slice(0, sentence + 1)
  }

  const word = slice.lastIndexOf(" ")
  return `${slice.slice(0, word > 0 ? word : max).trim()}…`
}

export function explanationParagraphs(text: string) {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function utcISO(offsetDays = 0) {
  const now = new Date()
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
  date.setUTCDate(date.getUTCDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

function asRecord(value: unknown) {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return null
}

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key]
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function isNasaError(value: unknown): value is { code: number; msg: string } {
  const record = asRecord(value)
  if (!record) {
    return false
  }

  return (
    typeof record.code === "number" &&
    typeof record.msg === "string" &&
    !readString(record, "title")
  )
}

function isNotFoundError(error: unknown) {
  return error instanceof Error && error.name === "ApodNotFound"
}

function normalize(value: unknown): ApodItem | null {
  const record = asRecord(value)
  if (!record) {
    return null
  }

  const date = readString(record, "date")
  const title = readString(record, "title")
  const explanation = readString(record, "explanation")
  const url = readString(record, "url")

  if (!date || !title || !explanation || !url) {
    return null
  }

  const media = readString(record, "media_type")
  const mediaType: ApodMedia =
    media === "image" || media === "video" ? media : "other"

  return {
    date,
    title,
    explanation,
    url,
    hdurl: readString(record, "hdurl"),
    mediaType,
    thumbnailUrl: readString(record, "thumbnail_url"),
    copyright: readString(record, "copyright"),
  }
}

function readHttps(url: URL) {
  return new Promise<{ status: number; body: unknown }>((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: "GET",
        headers: { accept: "application/json" },
        timeout: 12_000,
      },
      (response) => {
        const chunks: Buffer[] = []
        response.on("data", (chunk: Buffer) => {
          chunks.push(chunk)
        })
        response.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8")
          try {
            resolve({
              status: response.statusCode ?? 0,
              body: text ? (JSON.parse(text) as unknown) : null,
            })
          } catch {
            resolve({ status: response.statusCode ?? 0, body: null })
          }
        })
      }
    )

    request.on("timeout", () => {
      request.destroy(new Error("The picture service could not be reached."))
    })
    request.on("error", () => {
      reject(new Error("The picture service could not be reached."))
    })
    request.end()
  })
}

async function requestApod(apiKey: string, params: Record<string, string>) {
  const url = new URL(APOD_ENDPOINT)
  url.searchParams.set("api_key", apiKey)
  url.searchParams.set("thumbs", "true")

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  // api.nasa.gov negotiates HTTP/2 and then never answers from this network.
  // Node's HTTPS client stays on HTTP/1.1, which returns the picture promptly.
  const response = await readHttps(url)
  const body = response.body

  if (response.status < 200 || response.status >= 300 || isNasaError(body)) {
    const message = isNasaError(body)
      ? body.msg
      : `NASA responded with ${response.status}.`
    const dateProblem =
      response.status === 400 ||
      response.status === 404 ||
      /date|invalid|no data/i.test(message)

    if (dateProblem) {
      throw new ApodNotFound(message)
    }

    throw new Error(message)
  }

  return body
}

const PUBLISHED_APOD =
  "https://science.nasa.gov/wp-json/wp/v2/image-article?categories=22766&_embed=1&orderby=date&order=desc"

function isStubPicture(item: ApodItem) {
  return (
    item.title === "NASA Science" ||
    item.url.includes("nasa-logo") ||
    item.explanation.startsWith("Discover the cosmos!")
  )
}

function decodeEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code))
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;|&#8212;/g, "—")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function plainText(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
}

function publishedTitle(rendered: string) {
  const text = plainText(rendered)
  const match = text.match(
    /^APOD:\s+\d{4}\s+[A-Za-z]+\s+\d{1,2}\s+[–—-]\s+(.+)$/
  )
  return match?.[1]?.trim() || text
}

function publishedExplanation(html: string) {
  const text = decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
  )
  const match = text.match(
    /Explanation:\s*([\s\S]*?)(?:Tomorrow['’]s picture:|Date:)/i
  )
  return match?.[1]?.replace(/\s+/g, " ").trim() ?? ""
}

function publishedCredit(html: string) {
  const text = plainText(html)
  const match = text.match(
    /Credit:\s*(.*?)\s*(?:Authors\s*&\s*editors:|A service of:)/i
  )
  return match?.[1]?.replace(/\s+/g, " ").trim()
}

function publishedPicture(value: unknown): ApodItem | null {
  const post = asRecord(value)
  if (!post) {
    return null
  }

  const date = readString(post, "date")?.slice(0, 10)
  const titleRecord = asRecord(post.title)
  const contentRecord = asRecord(post.content)
  const title = titleRecord
    ? publishedTitle(readString(titleRecord, "rendered") ?? "")
    : ""
  const html = contentRecord
    ? (readString(contentRecord, "rendered") ?? "")
    : ""
  const explanation = publishedExplanation(html)
  const embedded = asRecord(post._embedded)
  const mediaList = embedded?.["wp:featuredmedia"]
  const media =
    Array.isArray(mediaList) && mediaList.length > 0
      ? asRecord(mediaList[0])
      : null
  const source = media ? readString(media, "source_url") : undefined
  const mime = media ? readString(media, "mime_type") : undefined

  if (!date || !title || !explanation || !source) {
    return null
  }

  const mediaType: ApodMedia = mime?.startsWith("video/") ? "video" : "image"

  return {
    date,
    title,
    explanation,
    url: source,
    hdurl: mediaType === "image" ? source : undefined,
    mediaType,
    copyright: publishedCredit(html),
  }
}

async function loadPublishedPictures(perPage: number) {
  const url = new URL(PUBLISHED_APOD)
  url.searchParams.set("per_page", String(perPage))
  const response = await readHttps(url)

  if (
    response.status < 200 ||
    response.status >= 300 ||
    !Array.isArray(response.body)
  ) {
    throw new Error("NASA Science did not return the published pictures.")
  }

  return response.body
    .map((entry) => publishedPicture(entry))
    .filter((item): item is ApodItem => item !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

async function repairStubPictures(items: ApodItem[]) {
  if (!items.some(isStubPicture)) {
    return items
  }

  try {
    const published = await loadPublishedPictures(ARCHIVE_DAYS)
    const byDate = new Map(published.map((item) => [item.date, item]))
    const repaired = items.map((item) =>
      isStubPicture(item) ? (byDate.get(item.date) ?? item) : item
    )
    const photographs = repaired.filter((item) => !isStubPicture(item))
    return photographs.length > 0 ? photographs : repaired
  } catch (error) {
    console.error(
      "APOD picture repair failed:",
      error instanceof Error ? error.message : "unknown"
    )
    return items
  }
}

async function fetchRange(apiKey: string, start: string, end: string) {
  const body = await requestApod(apiKey, {
    start_date: start,
    end_date: end,
  })

  if (!Array.isArray(body)) {
    throw new Error("NASA returned an unexpected archive.")
  }

  return body
    .map((entry) => normalize(entry))
    .filter((item): item is ApodItem => item !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

async function loadArchive() {
  const apiKey = process.env.NASA_API_KEY
  if (!apiKey) {
    throw new Error("NASA_API_KEY is not set")
  }

  try {
    return await repairStubPictures(
      await fetchRange(apiKey, utcISO(-(ARCHIVE_DAYS - 1)), utcISO())
    )
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error
    }

    return repairStubPictures(
      await fetchRange(apiKey, utcISO(-ARCHIVE_DAYS), utcISO(-1))
    )
  }
}

async function loadPicture(date: string) {
  const apiKey = process.env.NASA_API_KEY
  if (!apiKey) {
    throw new Error("NASA_API_KEY is not set")
  }

  const body = await requestApod(apiKey, { date })
  const item = normalize(body)
  if (!item) {
    throw new ApodNotFound()
  }

  if (!isStubPicture(item)) {
    return item
  }

  const [repaired] = await repairStubPictures([item])
  return repaired ?? item
}

const getCachedArchive = unstable_cache(loadArchive, ["apod-archive-v2"], {
  revalidate: 60 * 60,
})

const getCachedPicture = unstable_cache(loadPicture, ["apod-picture-v2"], {
  revalidate: 60 * 60 * 12,
})

export async function getArchive(): Promise<ApodCollection> {
  await connection()

  if (!process.env.NASA_API_KEY) {
    return { status: "missing-key" }
  }

  try {
    const items = await getCachedArchive()
    if (items.length === 0) {
      return { status: "unavailable" }
    }

    return { status: "ready", items }
  } catch (error) {
    console.error(
      "APOD archive failed:",
      error instanceof Error ? error.message : "unknown"
    )
    return { status: "unavailable" }
  }
}

export async function getHomePictures(): Promise<ApodCollection> {
  const archive = await getArchive()
  if (archive.status !== "ready") {
    return archive
  }

  return { status: "ready", items: archive.items.slice(0, HOME_COUNT) }
}

export async function getPicture(slug: string): Promise<ApodSingle> {
  await connection()

  if (!isApodSlug(slug)) {
    return { status: "not-found" }
  }

  if (!process.env.NASA_API_KEY) {
    return { status: "missing-key" }
  }

  try {
    const archive = await getCachedArchive()
    const match = archive.find((item) => item.date === slug)
    if (match) {
      return { status: "ready", item: match }
    }
  } catch {
    // A direct lookup can still succeed when the window is unavailable.
  }

  try {
    const item = await getCachedPicture(slug)
    return { status: "ready", item }
  } catch (error) {
    if (isNotFoundError(error)) {
      return { status: "not-found" }
    }

    console.error(
      "APOD entry failed:",
      error instanceof Error ? error.message : "unknown"
    )
    return { status: "unavailable" }
  }
}
