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
      <section className="rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-sky-950/30 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-200/80">
          Profil
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Klar for å opprette en dugnad
        </h1>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">E-post</p>
          <p className="mt-3 text-xl font-medium text-white">{email}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-sky-400/30 bg-slate-900/70 p-8">
        <h2 className="text-2xl font-semibold text-white">Dine Dugnader</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Her kommer det en liste over Dugnader du oppretter senere. Denne
          første auth-slicen viser bare hvilken konto som er logget inn.
        </p>
      </section>
    </main>
  );
}
