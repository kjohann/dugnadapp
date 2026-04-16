import Link from "next/link";

import {
  formatCommunityDate,
  getCommunityDeletePath,
  getCommunityEditPath,
} from "@/lib/community";
import {
  findOwnedCommunityBySlugOrNotFound,
  getAbsoluteCommunityUrl,
} from "@/lib/community-server";

type CommunityPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CommunityPage({
  params,
  searchParams,
}: CommunityPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const community = await findOwnedCommunityBySlugOrNotFound(slug);
  const fullUrl = await getAbsoluteCommunityUrl(community.slug);
  const wasCreated = getSearchParamValue(query.created) === "1";
  const wasUpdated = getSearchParamValue(query.updated) === "1";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-12 sm:px-10">
      <div>
        <Link
          href="/profile"
          className="text-sm text-foreground-muted transition hover:text-foreground"
        >
          &larr; Tilbake til profilen
        </Link>
      </div>

      <section className="rounded-3xl border border-border bg-surface p-8 shadow-md">
        {wasCreated ? (
          <div className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground">
            Dugnaden ble opprettet. Slug og full lenke er klare til senere deling.
          </div>
        ) : null}
        {wasUpdated ? (
          <div className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground">
            Dugnaden ble oppdatert.
          </div>
        ) : null}

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.3em] text-foreground-muted">
          Dugnad
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              {community.name}
            </h1>
            <p className="mt-2 text-sm text-foreground-muted">
              Arrangementsdato: {formatCommunityDate(community.eventDate)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={getCommunityEditPath(community.slug)}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Rediger
            </Link>
            <Link
              href={getCommunityDeletePath(community.slug)}
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Slett
            </Link>
          </div>
        </div>

        <dl className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface-muted p-5">
            <dt className="text-sm font-medium text-foreground-muted">Dato</dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">
              {formatCommunityDate(community.eventDate)}
            </dd>
          </div>
          <div className="rounded-2xl border border-border bg-surface-muted p-5">
            <dt className="text-sm font-medium text-foreground-muted">Slug</dt>
            <dd className="mt-2 font-mono text-sm text-foreground">{community.slug}</dd>
          </div>
          <div className="rounded-2xl border border-border bg-surface-muted p-5 lg:col-span-2">
            <dt className="text-sm font-medium text-foreground-muted">Full dugnad-lenke</dt>
            <dd className="mt-2 break-all font-mono text-sm text-foreground">
              <a href={fullUrl} className="underline decoration-border underline-offset-4">
                {fullUrl}
              </a>
            </dd>
          </div>
          <div className="rounded-2xl border border-border bg-surface-muted p-5 lg:col-span-2">
            <dt className="text-sm font-medium text-foreground-muted">Beskrivelse</dt>
            <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
              {community.description ?? "Ingen beskrivelse lagt til ennå."}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
