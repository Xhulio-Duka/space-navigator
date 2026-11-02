export type NewsletterState = {
  status: "idle" | "success" | "error"
  message: string
  id: string
}

export const newsletterInitialState: NewsletterState = {
  status: "idle",
  message: "",
  id: "initial",
}
