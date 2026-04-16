"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { CommunityFormState } from "@/lib/community";

type CommunityFormAction = (
  state: CommunityFormState,
  formData: FormData,
) => Promise<CommunityFormState>;

type CommunityFormProps = {
  action: CommunityFormAction;
  initialState: CommunityFormState;
  submitLabel: string;
  pendingLabel: string;
  cancelHref?: string;
};

export function CommunityForm({
  action,
  initialState,
  submitLabel,
  pendingLabel,
  cancelHref,
}: CommunityFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formKey = JSON.stringify(state.values);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.message ? (
        <p className="rounded-2xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning-fg">
          {state.message}
        </p>
      ) : null}

      <div key={formKey} className="contents">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Navn
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={state.values.name}
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="For eksempel Vårrydding i bakgården"
          />
          {state.fieldErrors.name ? (
            <p className="text-sm text-warning-fg">{state.fieldErrors.name}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className="text-sm font-medium text-foreground">
            Dato
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={state.values.date}
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {state.fieldErrors.date ? (
            <p className="text-sm text-warning-fg">{state.fieldErrors.date}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Beskrivelse
            </label>
            <span className="text-xs text-foreground-muted">Maks 1000 tegn</span>
          </div>
          <textarea
            id="description"
            name="description"
            rows={5}
            maxLength={1000}
            defaultValue={state.values.description}
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Valgfri kort beskrivelse av dugnaden."
          />
          {state.fieldErrors.description ? (
            <p className="text-sm text-warning-fg">{state.fieldErrors.description}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? pendingLabel : submitLabel}
        </button>
        {cancelHref ? (
          <Link
            href={cancelHref}
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Avbryt
          </Link>
        ) : null}
      </div>
    </form>
  );
}
