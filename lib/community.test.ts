import assert from "node:assert/strict";
import test from "node:test";

import {
  createBaseSlug,
  createOwnerHash,
  parseCommunityFormData,
} from "@/lib/community";

test("createOwnerHash normalizes email before hashing", () => {
  assert.equal(
    createOwnerHash(" Test@Example.com "),
    createOwnerHash("test@example.com"),
  );
});

test("createBaseSlug handles norwegian characters", () => {
  assert.equal(createBaseSlug("Vår-dugnad på Øvre Åsen"), "var-dugnad-pa-ovre-asen");
});

test("parseCommunityFormData rejects past dates", () => {
  const formData = new FormData();
  formData.set("name", "Helgedugnad");
  formData.set("date", "2000-01-01");
  formData.set("description", "");

  const result = parseCommunityFormData(formData);

  assert.equal(result.success, false);
  if (result.success) {
    throw new Error("Expected validation error");
  }

  assert.equal(result.state.fieldErrors.date, "Dato kan ikke være i fortiden.");
});
