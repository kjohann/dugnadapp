-- AlterTable: add ownerHash, eventDate, description to Community
-- Use temporary defaults so existing rows get values; defaults are dropped after
ALTER TABLE "Community"
  ADD COLUMN "ownerHash"   TEXT NOT NULL DEFAULT '',
  ADD COLUMN "eventDate"   DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN "description" TEXT;

-- Remove the temporary defaults (new rows must always supply these values)
ALTER TABLE "Community" ALTER COLUMN "ownerHash" DROP DEFAULT;
ALTER TABLE "Community" ALTER COLUMN "eventDate" DROP DEFAULT;

-- Add the owner-scoped listing indexes used by the profile page.
CREATE INDEX "Community_ownerHash_eventDate_idx" ON "Community"("ownerHash", "eventDate");
CREATE INDEX "Community_ownerHash_name_idx" ON "Community"("ownerHash", "name");
