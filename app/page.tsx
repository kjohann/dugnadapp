import { signInWithGoogle } from "@/app/actions/auth";
import { auth } from "@/auth";
import { getAuthSetupHint, hasRequiredAuthEnv } from "@/lib/auth-env";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  TODO: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30",
  IN_PROGRESS: "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30",
  DONE: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30",
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
        <div className="rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-sky-950/30 backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-200/80">
            For deg som vil arrangere
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Dugnadapp er klar for den første innloggingen for dugnadsarrangører.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Logg inn med Google for å komme til en enkel profilside. Den viser
            bare e-postadressen din nå, og gjør plass til framtidige
            arrangørfunksjoner senere.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2">
              Next.js App Router
            </span>
            <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2">
              TypeScript
            </span>
            <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2">
              Prisma + Postgres
            </span>
          </div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm font-medium text-white">
              Opprett en dugnad med en kjent konto
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Innloggingen er laget for deg som skal opprette eller administrere
              en dugnad.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {isSignedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                  >
                    Gå til profilen din
                  </Link>
                  <p className="text-sm text-slate-400">{session?.user?.email}</p>
                </>
              ) : authConfigured ? (
                <form action={signInWithGoogle}>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                  >
                    Logg inn med Google
                  </button>
                </form>
              ) : (
                <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  {authSetupHint}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-400">Dugnad</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {community?.name ?? "Manglende testdata"}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-400">Åpne oppgaver</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {tasks.length - completedTasks}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-400">Fullførte oppgaver</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {completedTasks}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Oppgaver i starteren</h2>
            <p className="text-slate-400">
              Hentet fra Postgres for å bevise at hele stakken virker lokalt.
            </p>
          </div>
          <p className="text-sm text-slate-500">Dugnad-slug: maple-street</p>
        </div>

        <div className="mt-6 grid gap-4">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{task.title}</h3>
                  {task.description ? (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
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
