import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test.describe("Public pages", () => {
  test("home page loads and shows hero text", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByRole("heading", { name: /perfect turf/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /explore turfs/i })).toBeVisible();
  });

  test("turfs listing page loads", async ({ page }) => {
    await page.goto(`${BASE}/turfs`);
    await expect(page.getByRole("heading", { name: /all turfs|football|cricket/i })).toBeVisible({ timeout: 10000 });
  });

  test("sport filter navigation works", async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("link", { name: /football/i }).first().click();
    await expect(page).toHaveURL(/sport=football/);
  });

  test("theme toggle switches between dark and light", async ({ page }) => {
    await page.goto(BASE);
    // Default should be dark
    await expect(page.locator("html")).toHaveClass(/dark/);
    // Click theme toggle
    const toggle = page.getByRole("button", { name: /light mode|dark mode/i });
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/light/);
    // Toggle back
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("PWA manifest is accessible", async ({ page }) => {
    const res = await page.request.get(`${BASE}/manifest.json`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.name).toContain("TurfMacha");
    expect(json.icons).toHaveLength(2);
  });

  test("robots.txt is accessible", async ({ page }) => {
    const res = await page.request.get(`${BASE}/robots.txt`);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("Disallow: /dashboard/");
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const res = await page.request.get(`${BASE}/sitemap.xml`);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("/turfs");
  });

  test("offline page renders", async ({ page }) => {
    await page.goto(`${BASE}/offline`);
    await expect(page.getByRole("heading", { name: /offline/i })).toBeVisible();
  });
});
