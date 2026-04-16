import { createHash } from "node:crypto";

export const communityDescriptionMaxLength = 1000;

export const communitySortFields = ["name", "date"] as const;
export const sortDirections = ["asc", "desc"] as const;

export type CommunitySortField = (typeof communitySortFields)[number];
export type SortDirection = (typeof sortDirections)[number];

export type CommunityFormValues = {
  name: string;
  date: string;
  description: string;
};

export type CommunityFormErrors = Partial<Record<keyof CommunityFormValues, string>>;

export type CommunityFormState = {
  message?: string;
  values: CommunityFormValues;
  fieldErrors: CommunityFormErrors;
};

export type ParsedCommunityFormData =
  | {
      success: true;
      data: {
        name: string;
        eventDate: Date;
        description: string | null;
      };
    }
  | {
      success: false;
      state: CommunityFormState;
    };

const norwegianDateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function createCommunityFormState(
  values: Partial<CommunityFormValues> = {},
  fieldErrors: CommunityFormErrors = {},
  message?: string,
): CommunityFormState {
  return {
    message,
    fieldErrors,
    values: {
      name: values.name ?? "",
      date: values.date ?? "",
      description: values.description ?? "",
    },
  };
}

export const emptyCommunityFormState = createCommunityFormState();

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createOwnerHash(email: string) {
  return createHash("sha256").update(normalizeEmail(email)).digest("hex");
}

export function createBaseSlug(name: string) {
  const asciiName = name
    .trim()
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  const slug = asciiName
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "dugnad";
}

export function formatCommunityDate(date: Date) {
  return norwegianDateFormatter.format(date);
}

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getCommunityPath(slug: string) {
  return `/dugnader/${slug}`;
}

export function getCommunityEditPath(slug: string) {
  return `${getCommunityPath(slug)}/rediger`;
}

export function getCommunityDeletePath(slug: string) {
  return `${getCommunityPath(slug)}/slett`;
}

export function getCommunitySortField(value: string | undefined): CommunitySortField {
  return value === "name" ? "name" : "date";
}

export function getSortDirection(value: string | undefined): SortDirection {
  return value === "desc" ? "desc" : "asc";
}

export function getNextSortDirection(
  activeField: CommunitySortField,
  activeDirection: SortDirection,
  clickedField: CommunitySortField,
): SortDirection {
  if (clickedField !== activeField) {
    return "asc";
  }

  return activeDirection === "asc" ? "desc" : "asc";
}

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function getTodayDateInput() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseCommunityFormData(formData: FormData): ParsedCommunityFormData {
  const values = {
    name: getStringValue(formData.get("name")).trim(),
    date: getStringValue(formData.get("date")).trim(),
    description: getStringValue(formData.get("description")).trim(),
  };

  const fieldErrors: CommunityFormErrors = {};

  if (!values.name) {
    fieldErrors.name = "Navn er påkrevd.";
  }

  if (!values.date) {
    fieldErrors.date = "Dato er påkrevd.";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
    fieldErrors.date = "Dato må være gyldig.";
  } else if (values.date < getTodayDateInput()) {
    fieldErrors.date = "Dato kan ikke være i fortiden.";
  }

  if (values.description.length > communityDescriptionMaxLength) {
    fieldErrors.description = "Beskrivelse kan ikke være lengre enn 1000 tegn.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: createCommunityFormState(values, fieldErrors),
    };
  }

  return {
    success: true,
    data: {
      name: values.name,
      eventDate: new Date(`${values.date}T00:00:00.000Z`),
      description: values.description || null,
    },
  };
}
