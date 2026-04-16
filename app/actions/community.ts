"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getCommunityPath,
  parseCommunityFormData,
  type CommunityFormState,
} from "@/lib/community";
import {
  createUniqueCommunitySlug,
  findOwnedCommunityBySlugOrNotFound,
  requireOrganizer,
} from "@/lib/community-server";
import { prisma } from "@/lib/prisma";

export async function createCommunityAction(
  _prevState: CommunityFormState,
  formData: FormData,
): Promise<CommunityFormState> {
  const organizer = await requireOrganizer();
  const parsed = parseCommunityFormData(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  const slug = await createUniqueCommunitySlug(parsed.data.name);

  await prisma.community.create({
    data: {
      name: parsed.data.name,
      slug,
      ownerHash: organizer.ownerHash,
      eventDate: parsed.data.eventDate,
      description: parsed.data.description,
    },
  });

  revalidatePath("/profile");
  redirect(`${getCommunityPath(slug)}?created=1`);
}

export async function updateCommunityAction(
  slug: string,
  _prevState: CommunityFormState,
  formData: FormData,
): Promise<CommunityFormState> {
  const community = await findOwnedCommunityBySlugOrNotFound(slug);
  const parsed = parseCommunityFormData(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  await prisma.community.update({
    where: { id: community.id },
    data: {
      name: parsed.data.name,
      eventDate: parsed.data.eventDate,
      description: parsed.data.description,
    },
  });

  revalidatePath("/profile");
  revalidatePath(getCommunityPath(community.slug));
  revalidatePath(`${getCommunityPath(community.slug)}/rediger`);
  redirect(`${getCommunityPath(community.slug)}?updated=1`);
}

export async function deleteCommunityAction(slug: string) {
  const community = await findOwnedCommunityBySlugOrNotFound(slug);

  await prisma.community.delete({
    where: { id: community.id },
  });

  revalidatePath("/profile");
  redirect("/profile?deleted=1");
}
