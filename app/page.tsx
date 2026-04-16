import { signInWithGoogle } from "@/app/actions/auth";
import { auth } from "@/auth";
import { getAuthSetupHint, hasRequiredAuthEnv } from "@/lib/auth-env";
import JoinByCode from "@/app/components/JoinByCode";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  const isSignedIn = Boolean(session?.user?.email);
  const authConfigured = hasRequiredAuthEnv();
  const authSetupHint = getAuthSetupHint();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-6 py-16 sm:px-10">
      {/* Hero */}
      <section className="rounded-3xl border border-border bg-surface p-8 shadow-md">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Dugnad
        </h1>
        <p className="mt-4 text-lg leading-8 text-foreground-muted">
          En app for å arrangere Dugnader og holde oversikt over oppgaver som skal gjøres.
        </p>
      </section>

      {/* Auth area */}
      <section className="rounded-3xl border border-border bg-surface-muted p-8">
        <h2 className="text-xl font-semibold text-foreground">Opprett eller administrer en dugnad</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Logg inn for å opprette og administrere Dugnader.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Gå til profilen din
              </Link>
              <p className="text-sm text-foreground-muted">{session?.user?.email}</p>
            </>
          ) : authConfigured ? (
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Logg inn / registrer deg
              </button>
            </form>
          ) : (
            <div className="rounded-2xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning-fg">
              {authSetupHint}
            </div>
          )}
        </div>
      </section>

      {/* Join by code */}
      <JoinByCode />
    </main>
  );
}
