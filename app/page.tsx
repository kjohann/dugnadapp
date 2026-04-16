import { signInWithGoogle } from "@/app/actions/auth";
import { auth } from "@/auth";
import { getAuthSetupHint, hasRequiredAuthEnv } from "@/lib/auth-env";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  TODO: "bg-status-todo-bg text-status-todo-fg ring-1 ring-status-todo-border",
  IN_PROGRESS:
    "bg-status-inprogress-bg text-status-inprogress-fg ring-1 ring-status-inprogress-border",
  DONE: "bg-status-done-bg text-status-done-fg ring-1 ring-status-done-border",
};

const statusLabel: Record<string, string> = {
  TODO: "Ikke startet",
  IN_PROGRESS: "Pågår",
  DONE: "Ferdig",
};

export default async function Home() {
  const [community, session] = await Promise.all([
    prisma.community.findUnique({
      where: { slug: "maple-street" },
      include: {
        tasks: {
          orderBy: [{ status: "asc" }, { createdAt: "asc" }],
        },
      },
    }),
    auth(),
  ]);

  const tasks = community?.tasks ?? [];
  const completedTasks = tasks.filter((task) => task.status === "DONE").length;
  const isSignedIn = Boolean(session?.user?.email);
  const authConfigured = hasRequiredAuthEnv();
  const authSetupHint = getAuthSetupHint();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-md">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-foreground-muted">
            For deg som vil arrangere
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Dugnadapp er klar for den første innloggingen for dugnadsarrangører.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground-muted">
            Logg inn med Google for å komme til en enkel profilside. Den viser
            bare e-postadressen din nå, og gjør plass til framtidige
            arrangørfunksjoner senere.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-foreground-muted">
            <span className="rounded-full border border-border bg-surface-muted px-4 py-2">
              Next.js App Router
            </span>
            <span className="rounded-full border border-border bg-surface-muted px-4 py-2">
              TypeScript
            </span>
            <span className="rounded-full border border-border bg-surface-muted px-4 py-2">
              Prisma + Postgres
            </span>
          </div>
          <div className="mt-8 rounded-2xl border border-border bg-surface-muted p-6">
            <p className="text-sm font-medium text-foreground">
              Opprett en dugnad med en kjent konto
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-muted">
              Innloggingen er laget for deg som skal opprette eller administrere
              en dugnad.
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
                    Logg inn med Google
                  </button>
                </form>
              ) : (
                <div className="rounded-2xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning-fg">
                  {authSetupHint}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-3xl border border-border bg-surface-muted p-6">
            <p className="text-sm text-foreground-muted">Dugnad</p>
            <p className="mt-3 text-2xl font-semibold text-foreground">
              {community?.name ?? "Manglende testdata"}
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-muted p-6">
            <p className="text-sm text-foreground-muted">Åpne oppgaver</p>
            <p className="mt-3 text-2xl font-semibold text-foreground">
              {tasks.length - completedTasks}
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-surface-muted p-6">
            <p className="text-sm text-foreground-muted">Fullførte oppgaver</p>
            <p className="mt-3 text-2xl font-semibold text-foreground">
              {completedTasks}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface-muted p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Oppgaver i starteren</h2>
            <p className="text-foreground-muted">
              Hentet fra Postgres for å bevise at hele stakken virker lokalt.
            </p>
          </div>
          <p className="text-sm text-foreground-muted">Dugnad-slug: maple-street</p>
        </div>

        <div className="mt-6 grid gap-4">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground">{task.title}</h3>
                  {task.description ? (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-muted">
                      {task.description}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusTone[task.status]}`}
                >
                  {statusLabel[task.status]}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
