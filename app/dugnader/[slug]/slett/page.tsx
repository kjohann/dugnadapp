import Link from "next/link";

import { deleteCommunityAction } from "@/app/actions/community";
import { formatCommunityDate, getCommunityPath } from "@/lib/community";
import { findOwnedCommunityBySlugOrNotFound } from "@/lib/community-server";

type DeleteCommunityPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DeleteCommunityPage({
  params,
}: DeleteCommunityPageProps) {
  const { slug } = await params;
  const community = await findOwnedCommunityBySlugOrNotFound(slug);
  const deleteAction = deleteCommunityAction.bind(null, community.slug);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-12 sm:px-10">
      <div>
        <Link
          href={getCommunityPath(community.slug)}
          className="text-sm text-foreground-muted transition hover:text-foreground"
        >
          &larr; Tilbake til dugnaden
        </Link>
      </div>

      <section className="rounded-3xl border border-border bg-surface p-8 shadow-md">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-foreground-muted">
          Slett dugnad
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Bekreft sletting
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-muted">
          Denne handlingen sletter dugnaden permanent. Oppgaver som hører til dugnaden
          blir også slettet.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-surface-muted p-6">
          <p className="text-sm text-foreground-muted">Dugnad</p>
          <p className="mt-2 text-xl font-semibold text-foreground">{community.name}</p>
          <p className="mt-2 text-sm text-foreground-muted">
            Dato: {formatCommunityDate(community.eventDate)}
          </p>
        </div>

        <form action={deleteAction} className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Ja, slett dugnaden
          </button>
          <Link
            href={getCommunityPath(community.slug)}
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Nei, behold den
          </Link>
        </form>
      </section>
    </main>
  );
}
