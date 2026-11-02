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
  const submitted = useRef(false)

  useEffect(() => {
    if (state.status === "idle") {
      return
    }

    submitted.current = false

    if (state.status === "success") {
      toast.success(state.message)
      formRef.current?.reset()
      return
    }

    if (state.message === "This address has already been sent.") {
      submitted.current = true
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
      onSubmit={(event) => {
        if (submitted.current) {
          event.preventDefault()
          return
        }

        submitted.current = true
      }}
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
            onChange={() => {
              submitted.current = false
            }}
          />
          <FieldDescription id="newsletter-help">
            Each address can be sent once. We only use it to tell the editor.
          </FieldDescription>
          {invalid ? <FieldError>{state.message}</FieldError> : null}
        </Field>
      </FieldGroup>
      <SubscribeButton />
    </form>
  )
}
