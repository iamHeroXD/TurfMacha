import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Emulate Indian Android device (mid-range)
    ...devices["Pixel 5"],
    locale: "en-IN",
    timezoneId: "Asia/Kolkata",
  },

  projects: [
    // Primary: Android Chrome (main target audience)
    {
      name: "android-chrome",
      use: { ...devices["Pixel 5"] },
    },
    // Secondary: iPhone Safari
    {
      name: "iphone-safari",
      use: { ...devices["iPhone 13"] },
    },
    // Desktop Chrome
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Start Next.js dev server before tests (use only for local testing)
  // webServer: {
  //   command: "npm run dev",
  //   url: BASE_URL,
  //   reuseExistingServer: !process.env.CI,
  // },
});
