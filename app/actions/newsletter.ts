"use server"

import { Resend } from "resend"
import { z } from "zod"
import type { NewsletterState } from "@/lib/newsletter"

const emailSchema = z.email("Enter a valid email address.")

const SENDER = "SpaceNavigator <onboarding@resend.dev>"

export async function subscribeToNewsletter(
  _previous: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const raw = formData.get("email")
  const email = typeof raw === "string" ? raw.trim() : ""
  const parsed = emailSchema.safeParse(email)

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "Enter a valid email address.",
      id: crypto.randomUUID(),
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.NEWSLETTER_TO_EMAIL
  const recipientOk = recipient
    ? emailSchema.safeParse(recipient).success
    : false

  if (!apiKey || !recipientOk || !recipient) {
    return {
      status: "error",
      message:
        "The newsletter is not configured. Set RESEND_API_KEY and NEWSLETTER_TO_EMAIL on the server before signups can be sent.",
      id: crypto.randomUUID(),
    }
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: SENDER,
    to: recipient,
    replyTo: parsed.data,
    subject: "New SpaceNavigator subscriber",
    text: `${parsed.data} asked to receive the SpaceNavigator daily note.`,
  })

  if (error) {
    console.error("Newsletter send failed:", error.message)
    return {
      status: "error",
      message: "The signup could not be sent. Try again in a moment.",
      id: crypto.randomUUID(),
    }
  }

  return {
    status: "success",
    message: "You're on the list.",
    id: crypto.randomUUID(),
  }
}
