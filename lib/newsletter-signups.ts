import { mkdir, open, readFile, rm } from "node:fs/promises"
import path from "node:path"

const directory = path.join(process.cwd(), ".next", "newsletter-signups")
const legacyPath = path.join(process.cwd(), "data", "newsletter-signups.json")

let legacyImport: Promise<void> | null = null

function claimPath(email: string) {
  return path.join(directory, `${encodeURIComponent(email)}.txt`)
}

function alreadyExists(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "EEXIST"
  )
}

async function reserve(email: string) {
  await mkdir(directory, { recursive: true })

  try {
    const handle = await open(claimPath(email), "wx")
    await handle.writeFile(email)
    await handle.close()
    return "new" as const
  } catch (error) {
    if (alreadyExists(error)) {
      return "duplicate" as const
    }

    throw error
  }
}

async function release(email: string) {
  await rm(claimPath(email), { force: true })
}

function importLegacyClaims() {
  legacyImport ??= (async () => {
    try {
      const raw = await readFile(legacyPath, "utf8")
      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        return
      }

      for (const item of parsed) {
        if (typeof item === "string" && item.length > 0) {
          await reserve(item.toLowerCase())
        }
      }
    } catch {
      // The older list is optional.
    }
  })()

  return legacyImport
}

export function claimSignup(
  email: string,
  send: () => Promise<{ ok: true } | { ok: false; message: string }>
) {
  return importLegacyClaims().then(async () => {
    const claim = await reserve(email)
    if (claim === "duplicate") {
      return { status: "duplicate" as const }
    }

    try {
      const result = await send()
      if (!result.ok) {
        await release(email)
        return { status: "failed" as const, message: result.message }
      }
    } catch {
      // Keep the claim. A thrown send can still have reached the inbox,
      // and a dev reload must not be able to send it again.
      return { status: "duplicate" as const }
    }

    return { status: "sent" as const }
  })
}
