import type { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createBaseSlug,
  createOwnerHash,
  getCommunityPath,
  type CommunitySortField,
  type SortDirection,
} from "@/lib/community";
import { prisma } from "@/lib/prisma";

export async function requireOrganizer() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/");
  }

  return {
    email,
    ownerHash: createOwnerHash(email),
  };
}

export function getCommunityOrderBy(
  sortField: CommunitySortField,
  direction: SortDirection,
): Prisma.CommunityOrderByWithRelationInput[] {
  if (sortField === "name") {
    return [{ name: direction }, { eventDate: "asc" }, { createdAt: "asc" }];
  }

  return [{ eventDate: direction }, { name: "asc" }, { createdAt: "asc" }];
}

export async function listOwnedCommunities(
  sortField: CommunitySortField,
  direction: SortDirection,
) {
  const organizer = await requireOrganizer();
  const communities = await prisma.community.findMany({
    where: { ownerHash: organizer.ownerHash },
    orderBy: getCommunityOrderBy(sortField, direction),
  });

  return {
    ...organizer,
    communities,
  };
}

export async function findOwnedCommunityBySlugOrNotFound(slug: string) {
  const organizer = await requireOrganizer();
  const community = await prisma.community.findFirst({
    where: {
      slug,
      ownerHash: organizer.ownerHash,
    },
  });

  if (!community) {
    notFound();
  }

  return community;
}

export async function createUniqueCommunitySlug(name: string) {
  const baseSlug = createBaseSlug(name);
  let slug = baseSlug;
  let suffix = 2;

  // Keep the first generated route clean and only suffix on collisions.
  while (true) {
    const existing = await prisma.community.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function getAbsoluteCommunityUrl(slug: string) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    return getCommunityPath(slug);
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return new URL(getCommunityPath(slug), `${protocol}://${host}`).toString();
}
