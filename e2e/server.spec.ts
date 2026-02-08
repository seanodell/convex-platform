import { test, expect } from "./fixtures/convex";
import { runAccessibilityTests } from "./fixtures/a11y";

test.describe("Server Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/server");
  });

  test.describe("Visual Regression", () => {
    test("matches visual snapshot - light mode", async ({
      page,
      convexReady,
    }) => {
      await page.emulateMedia({ colorScheme: "light" });

      // Disable animations for consistent screenshots
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
          }
        `,
      });

      await expect(page).toHaveScreenshot("server-light.png", {
        fullPage: true,
      });
    });

    test("matches visual snapshot - dark mode", async ({
      page,
      convexReady,
    }) => {
      await page.emulateMedia({ colorScheme: "dark" });

      // Disable animations for consistent screenshots
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
          }
        `,
      });

      await expect(page).toHaveScreenshot("server-dark.png", {
        fullPage: true,
      });
    });
  });

  test.describe("Layout and Static Content", () => {
    test("displays header with logos and branding", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Convex + Next.js" }),
      ).toBeVisible();
      await expect(page.getByAltText("Convex Logo")).toBeVisible();
      await expect(page.getByAltText("Next.js Logo")).toBeVisible();
    });

    test("displays section headings", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Non-reactive server-loaded data" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Reactive client-loaded data" }),
      ).toBeVisible();
    });
  });

  test.describe("Server-Side Rendering", () => {
    test("displays server-preloaded data immediately", async ({ page }) => {
      // Server-rendered data should be visible immediately (no loading state)
      const serverDataSection = page
        .getByRole("heading", { name: "Non-reactive server-loaded data" })
        .locator("..")
        .locator("code");

      await expect(serverDataSection).toBeVisible({ timeout: 1000 });

      // Verify it contains JSON data
      const codeContent = await serverDataSection.textContent();
      expect(codeContent).toBeTruthy();

      // Should be valid JSON
      expect(() => JSON.parse(codeContent || "{}")).not.toThrow();
    });

    test("server data contains expected structure", async ({ page }) => {
      const serverDataSection = page
        .getByRole("heading", { name: "Non-reactive server-loaded data" })
        .locator("..")
        .locator("code");

      const codeContent = await serverDataSection.textContent();
      const data = JSON.parse(codeContent || "{}");

      // Verify data structure
      expect(data).toHaveProperty("viewer");
      expect(data).toHaveProperty("numbers");
      expect(Array.isArray(data.numbers)).toBeTruthy();
    });

    test("displays formatted JSON with proper indentation", async ({
      page,
    }) => {
      const preElement = page.locator("code > pre").first();
      const content = await preElement.textContent();

      // Check for proper JSON formatting (should have newlines and indentation)
      expect(content).toContain("\n");
      expect(content).toContain("  "); // 2-space indentation
    });
  });

  test.describe("Client-Side Reactive Data", () => {
    test("displays reactive client-loaded data section", async ({
      page,
      convexReady,
    }) => {
      const reactiveSection = page.getByRole("heading", {
        name: "Reactive client-loaded data",
      });
      await expect(reactiveSection).toBeVisible();
    });

    test("reactive data updates when mutation executed", async ({
      page,
      convexReady,
    }) => {
      const button = page.getByRole("button", { name: "Add a random number" });
      await expect(button).toBeVisible();

      // Get the reactive data section (last code block)
      const reactiveDataSection = page.locator("code > pre").last();
      const beforeText = await reactiveDataSection.textContent();

      // Click button to add number
      await button.click();

      // Wait for data to update (reactive sync)
      await expect(async () => {
        const afterText = await reactiveDataSection.textContent();
        expect(afterText).not.toBe(beforeText);
      }).toPass({ timeout: 2000 });
    });

    test("add number button is clickable and responsive", async ({
      page,
      convexReady,
    }) => {
      const button = page.getByRole("button", { name: "Add a random number" });
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();

      // Hover effect (button should be interactive)
      await button.hover();
      // Button should still be visible after hover
      await expect(button).toBeVisible();
    });
  });

  test.describe("Data Consistency", () => {
    test("server and client data show consistent structure", async ({
      page,
      convexReady,
    }) => {
      const serverData = await page.locator("code > pre").first().textContent();
      const clientData = await page.locator("code > pre").last().textContent();

      const serverJson = JSON.parse(serverData || "{}");
      const clientJson = JSON.parse(clientData || "{}");

      // Both should have the same structure
      expect(Object.keys(serverJson)).toEqual(Object.keys(clientJson));
      expect(Array.isArray(serverJson.numbers)).toBe(
        Array.isArray(clientJson.numbers),
      );
    });

    test("numbers array is limited to 3 items", async ({
      page,
      convexReady,
    }) => {
      const serverData = await page.locator("code > pre").first().textContent();
      const data = JSON.parse(serverData || "{}");

      // Server page uses count: 3
      expect(data.numbers.length).toBeLessThanOrEqual(3);
    });
  });

  test.describe("Navigation", () => {
    test("can navigate back to home page", async ({ page }) => {
      // Navigate to home
      await page.goto("/");
      await expect(page).toHaveURL("/");

      // Come back to server page
      await page.goto("/server");
      await expect(page).toHaveURL("/server");
    });
  });

  test.describe("Accessibility", () => {
    test("has no accessibility violations", async ({ page, convexReady }) => {
      await runAccessibilityTests(page);
    });

    test("can navigate with keyboard", async ({ page, convexReady }) => {
      // Tab to the button
      await page.keyboard.press("Tab");
      const button = page.getByRole("button", { name: "Add a random number" });
      await expect(button).toBeFocused();

      // Activate with Enter
      const beforeText = await page.locator("code > pre").last().textContent();
      await page.keyboard.press("Enter");

      // Verify action executed
      await expect(async () => {
        const afterText = await page.locator("code > pre").last().textContent();
        expect(afterText).not.toBe(beforeText);
      }).toPass({ timeout: 2000 });
    });

    test("code blocks have proper semantic markup", async ({ page }) => {
      const codeElements = page.locator("code");
      const count = await codeElements.count();
      expect(count).toBeGreaterThan(0);

      // Verify code contains pre elements for proper formatting
      const preElements = page.locator("code > pre");
      const preCount = await preElements.count();
      expect(preCount).toBeGreaterThan(0);
    });
  });

  test.describe("Responsive Design", () => {
    test("displays correctly on mobile viewport", async ({
      page,
      convexReady,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      await expect(
        page.getByRole("heading", { name: "Convex + Next.js" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Non-reactive server-loaded data" }),
      ).toBeVisible();

      // Code blocks should still be visible and not overflow
      const codeBlock = page.locator("code > pre").first();
      await expect(codeBlock).toBeVisible();
    });

    test("displays correctly on tablet viewport", async ({
      page,
      convexReady,
    }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad

      await expect(
        page.getByRole("heading", { name: "Convex + Next.js" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Non-reactive server-loaded data" }),
      ).toBeVisible();
    });
  });

  test.describe("Performance", () => {
    test("server-rendered content is immediately available", async ({
      page,
    }) => {
      const startTime = Date.now();

      await page.goto("/server");

      // Check if server data is visible very quickly (SSR benefit)
      await expect(
        page
          .getByRole("heading", { name: "Non-reactive server-loaded data" })
          .locator("..")
          .locator("code"),
      ).toBeVisible({ timeout: 1000 });

      const loadTime = Date.now() - startTime;

      // Server-rendered page should be fast (< 3 seconds including navigation)
      expect(loadTime).toBeLessThan(3000);
    });
  });
});
