import { test as base, expect } from "@playwright/test";

/**
 * Custom fixture that waits for Convex client to be ready
 * Use this fixture in tests that depend on Convex data loading
 */
type ConvexFixtures = {
  convexReady: void;
};

export const test = base.extend<ConvexFixtures>({
  convexReady: async ({ page }, use) => {
    // Step 1: Wait for DOM content loaded
    await page.waitForLoadState("domcontentloaded");

    // Step 2: Check for React hydration (Next.js root)
    const hasNextRoot = await page.evaluate(() => {
      const root = document.querySelector("#__next");
      return root && root.innerHTML.length > 0;
    });

    if (!hasNextRoot) {
      // If no #__next, wait briefly for any rendering to complete
      await page.waitForTimeout(100);
    }

    // Step 3: Wait for loading indicator to disappear if present
    const loadingSelector = 'text="Loading..."';
    const loadingCount = await page.locator(loadingSelector).count();
    if (loadingCount > 0) {
      await page.waitForSelector(loadingSelector, {
        state: "hidden",
        timeout: 8000,
      });
    }

    // Step 4: Wait for network idle (Convex subscriptions to establish)
    try {
      await page.waitForLoadState("networkidle", { timeout: 5000 });
    } catch {
      // Continue even if network never goes idle
    }

    // Step 5: Additional buffer for Convex real-time subscriptions to stabilize
    await page.waitForTimeout(500);

    await use();
  },
});

export { expect };

/**
 * Helper function to wait for a specific Convex query to complete
 */
export async function waitForConvexQuery(
  page: any,
  options: { timeout?: number } = {},
) {
  const timeout = options.timeout || 5000;

  await page.waitForFunction(
    () => {
      const loadingElements = document.querySelectorAll(
        '[class*="animate-bounce"]',
      );
      return loadingElements.length === 0;
    },
    { timeout },
  );
}
