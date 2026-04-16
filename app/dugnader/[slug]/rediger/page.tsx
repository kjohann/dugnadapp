import Link from "next/link";

import { updateCommunityAction } from "@/app/actions/community";
import { CommunityForm } from "@/app/components/community-form";
import {
  createCommunityFormState,
  getCommunityPath,
  toDateInputValue,
} from "@/lib/community";
import { findOwnedCommunityBySlugOrNotFound } from "@/lib/community-server";

type EditCommunityPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditCommunityPage({ params }: EditCommunityPageProps) {
  const { slug } = await params;
  const community = await findOwnedCommunityBySlugOrNotFound(slug);
  const updateAction = updateCommunityAction.bind(null, community.slug);

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
          Rediger dugnad
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          {community.name}
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Slugen beholdes uendret slik at lenken fortsetter å virke.
        </p>

        <div className="mt-8">
          <CommunityForm
            action={updateAction}
            initialState={createCommunityFormState({
              name: community.name,
              date: toDateInputValue(community.eventDate),
              description: community.description ?? "",
            })}
            submitLabel="Lagre endringer"
            pendingLabel="Lagrer endringer..."
            cancelHref={getCommunityPath(community.slug)}
          />
        </div>
      </section>
    </main>
  );
}
