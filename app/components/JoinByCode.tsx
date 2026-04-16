"use client";

import { useState } from "react";

export default function JoinByCode() {
  const [code, setCode] = useState("");

  function handleJoin() {
    // Placeholder: real join behavior is out of scope for this issue.
  }

  return (
    <section className="rounded-3xl border border-border bg-surface-muted p-8">
      <h2 className="text-xl font-semibold text-foreground">Bli med i en dugnad</h2>
      <p className="mt-2 text-sm text-foreground-muted">
        Har du en kode? Skriv den inn nedenfor for å bli med.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Dugnadskode</span>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Skriv inn koden her"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <button
          type="button"
          onClick={handleJoin}
          disabled={code.trim() === ""}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
        >
          Bli med
        </button>
      </div>
    </section>
  );
}
