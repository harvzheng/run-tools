import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("shows tool catalog", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "RunTools", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Heart Rate Zones" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Pace converter", exact: true }),
    ).toBeVisible();
  });

  test("navigates to HR zones tool", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Heart Rate Zones");
    await expect(page).toHaveURL("/tools/hr-zones");
    await expect(
      page.getByRole("heading", { name: "Heart Rate Zones" }),
    ).toBeVisible();
  });
});

test.describe("Heart Rate Zones", () => {
  test("shows zones and updates on age change", async ({ page }) => {
    await page.goto("/tools/hr-zones");

    // Should show zone bars
    await expect(page.getByText("Easy / Recovery")).toBeVisible();
    await expect(page.getByText("VO2max / Anaerobic")).toBeVisible();

    // Change age
    const ageInput = page.locator("#age");
    await ageInput.fill("25");

    // Zones should update — max HR for age 25 is 195
    // Z1: 50% of 195 = 98, 60% of 195 = 117
    await expect(page.getByText("98–117 bpm")).toBeVisible();
  });

  test("switches between methods", async ({ page }) => {
    await page.goto("/tools/hr-zones");

    // Switch to Karvonen
    await page.click("text=Karvonen");
    await expect(page.getByLabel("Resting Heart Rate")).toBeVisible();

    // Switch to LTHR
    await page.click("text=LTHR");
    await expect(page.getByLabel("Lactate Threshold HR")).toBeVisible();
  });
});

test.describe("Pace Converter", () => {
  test("shows all pace fields and race times", async ({ page }) => {
    await page.goto("/tools/pace-converter");

    await expect(page.getByLabel("min/km")).toBeVisible();
    await expect(page.getByLabel("min/mi")).toBeVisible();
    await expect(page.getByLabel("km/h")).toBeVisible();
    await expect(page.getByLabel("mph")).toBeVisible();

    // Race times should be visible
    await expect(page.getByText("5K")).toBeVisible();
    await expect(page.getByText("Marathon", { exact: true })).toBeVisible();
  });
});

test.describe("404", () => {
  test("shows 404 for nonexistent tool", async ({ page }) => {
    const response = await page.goto("/tools/nonexistent");
    expect(response?.status()).toBe(404);
  });
});
