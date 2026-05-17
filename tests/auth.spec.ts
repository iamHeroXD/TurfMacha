import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test.describe("Authentication", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByPlaceholder(/you@example\.com/i)).toBeVisible();
    await expect(page.getByPlaceholder(/\•+/)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
  });

  test("signup page renders and role toggle works", async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
    // Toggle to owner
    await page.getByRole("button", { name: /turf owner/i }).click();
    await expect(page.getByRole("button", { name: /turf owner/i })).toHaveCSS("background-color", /rgba/);
  });

  test("invalid login shows error", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('[type="email"]', "notreal@test.com");
    await page.fill('[type="password"]', "wrongpass");
    await page.getByRole("button", { name: /sign in/i }).click();
    // Should show an error message
    await expect(page.locator("p.text-red-400, .text-red-400")).toBeVisible({ timeout: 8000 });
  });

  test("forgot password page works", async ({ page }) => {
    await page.goto(`${BASE}/forgot-password`);
    await expect(page.getByRole("heading", { name: /forgot/i })).toBeVisible();
  });

  test("auth redirects: protected route without session → login", async ({ page }) => {
    await page.goto(`${BASE}/dashboard/user`);
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin route without session → login", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page).toHaveURL(/\/login/);
  });
});
