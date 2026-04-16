import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  TODO: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30",
  IN_PROGRESS: "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30",
  DONE: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30",
};

const statusLabel: Record<string, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export default async function Home() {
  const community = await prisma.community.findUnique({
    where: { slug: "maple-street" },
    include: {
      tasks: {
        orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  const tasks = community?.tasks ?? [];
  const completedTasks = tasks.filter((task) => task.status === "DONE").length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-sky-950/30 backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-200/80">
            Hello world, with the plumbing in place
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Dugnadapp is ready for its first community work board.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            This starter runs on Next.js with Prisma and Postgres, so later
            iterations can focus on real features instead of bootstrap work.
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
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-400">Community</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {community?.name ?? "Seed data missing"}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-400">Open tasks</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {tasks.length - completedTasks}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-400">Completed tasks</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {completedTasks}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Starter task list</h2>
            <p className="text-slate-400">
              Seeded from Postgres so the app proves the full stack path locally.
            </p>
          </div>
          <p className="text-sm text-slate-500">Community slug: maple-street</p>
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
