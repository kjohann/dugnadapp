import Link from "next/link";

import { createCommunityAction } from "@/app/actions/community";
import { CommunityForm } from "@/app/components/community-form";
import {
  emptyCommunityFormState,
  formatCommunityDate,
  getCommunityDeletePath,
  getCommunityEditPath,
  getCommunityPath,
  getCommunitySortField,
  getNextSortDirection,
  getSortDirection,
  type CommunitySortField,
  type SortDirection,
} from "@/lib/community";
import { listOwnedCommunities } from "@/lib/community-server";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildSortHref(
  currentField: CommunitySortField,
  currentDirection: SortDirection,
  clickedField: CommunitySortField,
) {
  const nextDirection = getNextSortDirection(
    currentField,
    currentDirection,
    clickedField,
  );

  return `/profile?sort=${clickedField}&direction=${nextDirection}`;
}

function getSortLabel(
  activeField: CommunitySortField,
  activeDirection: SortDirection,
  field: CommunitySortField,
) {
  if (field !== activeField) {
    return "Sorter";
  }

  return activeDirection === "asc" ? "Stigende" : "Synkende";
}

function getSortIndicator(
  activeField: CommunitySortField,
  activeDirection: SortDirection,
  field: CommunitySortField,
) {
  if (field !== activeField) {
    return "↕";
  }

  return activeDirection === "asc" ? "↑" : "↓";
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const query = await searchParams;
  const sortField = getCommunitySortField(getSearchParamValue(query.sort));
  const direction = getSortDirection(getSearchParamValue(query.direction));
  const wasDeleted = getSearchParamValue(query.deleted) === "1";
  const { email, communities } = await listOwnedCommunities(sortField, direction);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
      <section className="rounded-3xl border border-border bg-surface p-8 shadow-md">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-foreground-muted">
          Profil
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Opprett og styr Dugnadene dine
        </h1>
        <div className="mt-8 rounded-2xl border border-border bg-surface-muted p-6">
          <p className="text-sm text-foreground-muted">Innlogget som</p>
          <p className="mt-3 text-xl font-medium text-foreground">{email}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-8 shadow-md">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-foreground">Ny dugnad</h2>
          <p className="max-w-2xl text-sm leading-6 text-foreground-muted">
            Gi dugnaden et navn, velg en dato, og legg til en valgfri beskrivelse.
            Slugen opprettes automatisk og vises etter at dugnaden er lagret.
          </p>
        </div>

        <div className="mt-8">
          <CommunityForm
            action={createCommunityAction}
            initialState={emptyCommunityFormState}
            submitLabel="Opprett dugnad"
            pendingLabel="Oppretter dugnad..."
          />
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-8 shadow-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Dine Dugnader</h2>
            <p className="text-sm leading-6 text-foreground-muted">
              Bare Dugnader du selv eier vises her.
            </p>
          </div>
          {wasDeleted ? (
            <p className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground">
              Dugnaden ble slettet.
            </p>
          ) : null}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-foreground-muted">
                <th className="pb-2 pr-4 font-medium">
                  <Link
                    href={buildSortHref(sortField, direction, "name")}
                    className="inline-flex items-center gap-2 transition hover:text-foreground"
                  >
                    Navn
                    <span aria-hidden="true">
                      {getSortIndicator(sortField, direction, "name")}
                    </span>
                    <span className="sr-only">
                      {getSortLabel(sortField, direction, "name")}
                    </span>
                  </Link>
                </th>
                <th className="pb-2 pr-4 font-medium">
                  <Link
                    href={buildSortHref(sortField, direction, "date")}
                    className="inline-flex items-center gap-2 transition hover:text-foreground"
                  >
                    Dato
                    <span aria-hidden="true">
                      {getSortIndicator(sortField, direction, "date")}
                    </span>
                    <span className="sr-only">
                      {getSortLabel(sortField, direction, "date")}
                    </span>
                  </Link>
                </th>
                <th className="pb-2 pr-4 font-medium">Slug</th>
                <th className="pb-2 font-medium">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {communities.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="rounded-2xl border border-border bg-surface-muted px-4 py-6 text-sm text-foreground-muted"
                  >
                    Du har ingen Dugnader ennå.
                  </td>
                </tr>
              ) : (
                communities.map((community) => (
                  <tr
                    key={community.id}
                    className="rounded-2xl border border-border bg-surface-muted"
                  >
                    <td className="rounded-l-2xl border-y border-l border-border px-4 py-4 align-top">
                      <Link
                        href={getCommunityPath(community.slug)}
                        className="font-semibold text-foreground underline decoration-border underline-offset-4"
                      >
                        {community.name}
                      </Link>
                    </td>
                    <td className="border-y border-border px-4 py-4 align-top text-sm text-foreground">
                      {formatCommunityDate(community.eventDate)}
                    </td>
                    <td className="border-y border-border px-4 py-4 align-top font-mono text-sm text-foreground">
                      {community.slug}
                    </td>
                    <td className="rounded-r-2xl border-y border-r border-border px-4 py-4 align-top">
                      <div className="flex flex-wrap gap-3 text-sm">
                        <Link
                          href={getCommunityPath(community.slug)}
                          className="text-foreground underline decoration-border underline-offset-4"
                        >
                          Se
                        </Link>
                        <Link
                          href={getCommunityEditPath(community.slug)}
                          className="text-foreground underline decoration-border underline-offset-4"
                        >
                          Rediger
                        </Link>
                        <Link
                          href={getCommunityDeletePath(community.slug)}
                          className="text-foreground underline decoration-border underline-offset-4"
                        >
                          Slett
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
