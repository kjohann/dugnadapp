import { expect, test } from "@playwright/test";

const testEmail = "test@example.com";
const testAuthSecret = process.env.AUTH_TEST_MODE_SECRET;

test("kan logge inn med forberedt testbruker via synlig knapp", async ({ page }) => {
  if (!testAuthSecret) {
    throw new Error(
      "Sett AUTH_TEST_MODE_SECRET i worktreeets lokale .env-fil for å kjøre Playwright test-auth.",
    );
  }

  await page.goto("/");

  const prepareResult = await page.evaluate(
    async ({ email, secret }) => {
      const response = await fetch("/api/test-auth/prepare", {
        body: JSON.stringify({ email, secret }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      return {
        body: await response.text(),
        ok: response.ok,
        status: response.status,
      };
    },
    {
      email: testEmail,
      secret: testAuthSecret,
    },
  );

  expect(prepareResult, prepareResult.body).toEqual(
    expect.objectContaining({
      ok: true,
      status: 200,
    }),
  );

  await page.getByRole("button", { name: "Logg inn / registrer deg" }).click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByText(testEmail)).toBeVisible();
});
