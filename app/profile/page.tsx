import { auth } from "@/auth";

import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-12 sm:px-10">
      <section className="rounded-3xl border border-border bg-surface p-8 shadow-md">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-foreground-muted">
          Profil
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Klar for å opprette en dugnad
        </h1>
        <div className="mt-8 rounded-2xl border border-border bg-surface-muted p-6">
          <p className="text-sm text-foreground-muted">E-post</p>
          <p className="mt-3 text-xl font-medium text-foreground">{email}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-border-muted bg-surface-muted p-8">
        <h2 className="text-2xl font-semibold text-foreground">Dine Dugnader</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-muted">
          Her kommer det en liste over Dugnader du oppretter senere. Denne
          første auth-slicen viser bare hvilken konto som er logget inn.
        </p>
      </section>
    </main>
  );
}
