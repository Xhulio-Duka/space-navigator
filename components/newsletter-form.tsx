"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { subscribeToNewsletter } from "@/app/actions/newsletter"
import { newsletterInitialState } from "@/lib/newsletter"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

function SubscribeButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-fit">
      {pending ? <Spinner data-icon="inline-start" /> : null}
      {pending ? "Sending" : "Subscribe"}
    </Button>
  )
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(
    subscribeToNewsletter,
    newsletterInitialState
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === "idle") {
      return
    }

    if (state.status === "success") {
      toast.success(state.message)
      formRef.current?.reset()
      return
    }

    toast.error(state.message)
  }, [state.id, state.message, state.status])

  const invalid = state.status === "error"

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="flex flex-col gap-5"
    >
      <FieldGroup>
        <Field data-invalid={invalid ? true : undefined}>
          <FieldLabel htmlFor="newsletter-email">Email</FieldLabel>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={invalid ? true : undefined}
            aria-describedby="newsletter-help"
          />
          <FieldDescription id="newsletter-help">
            One address. We only use it to send the signup to the editor.
          </FieldDescription>
          {invalid ? <FieldError>{state.message}</FieldError> : null}
        </Field>
      </FieldGroup>
      <SubscribeButton />
    </form>
  )
}
