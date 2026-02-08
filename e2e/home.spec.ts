import { test, expect } from "./fixtures/convex";
import { runAccessibilityTests } from "./fixtures/a11y";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Visual Regression", () => {
    test("matches visual snapshot - light mode", async ({
      page,
      convexReady,
    }) => {
      await page.emulateMedia({ colorScheme: "light" });
      // convexReady fixture already waited for loading to complete

      // Disable animations for consistent screenshots
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
          }
        `,
      });

      await expect(page).toHaveScreenshot("home-light.png", {
        fullPage: true,
      });
    });

    test("matches visual snapshot - dark mode", async ({
      page,
      convexReady,
    }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      // convexReady fixture already waited for loading to complete

      // Disable animations for consistent screenshots
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
          }
        `,
      });

      await expect(page).toHaveScreenshot("home-dark.png", {
        fullPage: true,
      });
    });

    test("auth popover visual snapshot", async ({ page }) => {
      const authButton = page.getByRole("button", { name: "Want Auth?" });
      await authButton.click();
      await expect(page.getByText("WorkOS AuthKit")).toBeVisible();

      // Disable animations for consistent screenshots
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
          }
        `,
      });

      await expect(page).toHaveScreenshot("home-auth-popover.png");
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

    test("displays main content sections", async ({ page, convexReady }) => {
      // convexReady fixture already waited for loading to complete

      await expect(
        page.getByRole("heading", { name: "Welcome!" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Number generator" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Making changes" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Useful resources" }),
      ).toBeVisible();
    });

    test("displays resource cards with links", async ({
      page,
      convexReady,
    }) => {
      // convexReady fixture already waited for loading to complete

      await expect(page.getByText("Convex docs")).toBeVisible();
      await expect(page.getByText("Stack articles")).toBeVisible();
      await expect(page.getByText("Templates")).toBeVisible();
      await expect(page.getByText("Discord")).toBeVisible();
    });
  });

  test.describe("Loading States", () => {
    test("displays loading state then content", async ({ page }) => {
      // The loading state might be very brief, so we check for either state
      const hasLoadingState = await page
        .getByText("Loading...")
        .isVisible()
        .catch(() => false);

      if (hasLoadingState) {
        // If loading state is visible, wait for it to disappear
        await expect(page.getByText("Loading...")).toBeHidden({
          timeout: 10000,
        });
      }

      // Verify content loaded
      await expect(
        page.getByRole("heading", { name: "Welcome!" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Number generator" }),
      ).toBeVisible();
    });
  });

  test.describe("Number Generator Interactions", () => {
    test("generates random number when button clicked", async ({
      page,
      convexReady,
    }) => {
      // convexReady fixture already waited for loading to complete

      const button = page.getByRole("button", {
        name: "+ Generate random number",
      });
      await expect(button).toBeVisible();

      // Get current numbers display
      const numbersDisplay = page.getByText("Newest Numbers").locator("..");
      const beforeText = await numbersDisplay.textContent();

      // Click button to generate number
      await button.click();

      // Wait for the numbers display to change
      await expect(async () => {
        const afterText = await numbersDisplay.textContent();
        expect(afterText).not.toBe(beforeText);
      }).toPass({ timeout: 2000 });
    });

    test("displays generated numbers in list", async ({
      page,
      convexReady,
    }) => {
      // convexReady fixture already waited for loading to complete

      // Check if numbers exist or prompt to generate
      const numbersContainer = page
        .getByText("Newest Numbers")
        .locator("..")
        .locator("p")
        .last();

      await expect(numbersContainer).toBeVisible();

      const text = await numbersContainer.textContent();
      // Either shows prompt or actual numbers
      expect(
        text?.includes("Click the button") || /\d/.test(text || ""),
      ).toBeTruthy();
    });
  });

  test.describe("Auth Popover Interactions", () => {
    test("opens auth popover when button clicked", async ({ page }) => {
      const authButton = page.getByRole("button", { name: "Want Auth?" });
      await expect(authButton).toBeVisible();

      await authButton.click();

      // Verify popover content is visible
      await expect(page.getByText("WorkOS AuthKit")).toBeVisible();
      await expect(page.getByText("Clerk")).toBeVisible();
      await expect(page.getByText("Convex Auth")).toBeVisible();
    });

    test("closes auth popover when clicking outside", async ({ page }) => {
      await page.getByRole("button", { name: "Want Auth?" }).click();
      await expect(page.getByText("WorkOS AuthKit")).toBeVisible();

      // Click outside popover (on main heading)
      await page.getByRole("heading", { name: "Convex + Next.js" }).click();

      // Verify popover closes
      await expect(page.getByText("WorkOS AuthKit")).toBeHidden();
    });

    test("switches between auth providers", async ({ page }) => {
      await page.getByRole("button", { name: "Want Auth?" }).click();

      // Verify default selection (authkit)
      const authkitRadio = page.getByRole("radio", { name: /WorkOS AuthKit/ });
      await expect(authkitRadio).toBeChecked();

      // Click Clerk option
      const clerkRadio = page.getByRole("radio", { name: /Clerk/ });
      await clerkRadio.click();
      await expect(clerkRadio).toBeChecked();
      await expect(authkitRadio).not.toBeChecked();

      // Click Convex Auth option
      const convexAuthRadio = page.getByRole("radio", { name: /Convex Auth/ });
      await convexAuthRadio.click();
      await expect(convexAuthRadio).toBeChecked();
      await expect(clerkRadio).not.toBeChecked();
    });

    test("copies auth command to clipboard", async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(["clipboard-write", "clipboard-read"]);

      await page.getByRole("button", { name: "Want Auth?" }).click();

      // Click copy button
      const copyButton = page.getByRole("button", { name: "Copy" });
      await copyButton.click();

      // Verify "Copied!" feedback
      await expect(page.getByRole("button", { name: "Copied!" })).toBeVisible({
        timeout: 2000,
      });

      // Verify clipboard content
      const clipboardText = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      expect(clipboardText).toContain("npm create convex@latest");
      expect(clipboardText).toContain("--template");
    });

    test("displays correct command for each auth provider", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Want Auth?" }).click();

      // Check AuthKit command
      const codeDisplay = page.locator("code").filter({ hasText: "npm" });
      await expect(codeDisplay).toContainText("nextjs-authkit");

      // Switch to Clerk
      await page.getByRole("radio", { name: /Clerk/ }).click();
      await expect(codeDisplay).toContainText("nextjs-clerk");

      // Switch to Convex Auth
      await page.getByRole("radio", { name: /Convex Auth/ }).click();
      await expect(codeDisplay).toContainText("nextjs-convexauth");
    });
  });

  test.describe("Navigation", () => {
    test("navigates to /server route", async ({ page, convexReady }) => {
      // convexReady fixture already waited for loading to complete

      const link = page.getByRole("link", { name: "/server route" });
      await expect(link).toBeVisible();

      await link.click();

      // Verify navigation
      await expect(page).toHaveURL("/server");
    });

    test("resource card links have correct href attributes", async ({
      page,
      convexReady,
    }) => {
      // convexReady fixture already waited for loading to complete

      // Check external links exist and have href attributes
      const convexDocsLink = page.getByRole("link", { name: /Convex docs/ });
      await expect(convexDocsLink).toHaveAttribute(
        "href",
        "https://docs.convex.dev/home",
      );

      const templatesLink = page.getByRole("link", { name: /Templates/ });
      await expect(templatesLink).toHaveAttribute(
        "href",
        "https://www.convex.dev/templates",
      );

      const discordLink = page.getByRole("link", { name: /Discord/ });
      await expect(discordLink).toHaveAttribute(
        "href",
        "https://www.convex.dev/community",
      );
    });
  });

  test.describe("Accessibility", () => {
    test("has no accessibility violations", async ({ page, convexReady }) => {
      await page.waitForSelector('text="Loading..."', {
        state: "hidden",
        timeout: 10000,
      });
      await runAccessibilityTests(page);
    });

    test("auth popover has no accessibility violations", async ({ page }) => {
      await page.getByRole("button", { name: "Want Auth?" }).click();
      await expect(page.getByText("WorkOS AuthKit")).toBeVisible();
      await runAccessibilityTests(page);
    });

    test("can navigate with keyboard", async ({ page, convexReady }) => {
      // convexReady fixture already waited for loading to complete

      // Tab to auth button
      await page.keyboard.press("Tab");
      const authButton = page.getByRole("button", { name: "Want Auth?" });
      await expect(authButton).toBeFocused();

      // Open with Enter
      await page.keyboard.press("Enter");
      await expect(page.getByText("WorkOS AuthKit")).toBeVisible();

      // Tab through radio buttons
      await page.keyboard.press("Tab");
      const firstRadio = page.getByRole("radio").first();
      await expect(firstRadio).toBeFocused();
    });
  });

  test.describe("Responsive Design", () => {
    test("displays correctly on mobile viewport", async ({
      page,
      convexReady,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      // convexReady fixture already waited for loading to complete

      await expect(
        page.getByRole("heading", { name: "Convex + Next.js" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Welcome!" }),
      ).toBeVisible();
    });

    test("displays correctly on tablet viewport", async ({
      page,
      convexReady,
    }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      // convexReady fixture already waited for loading to complete

      await expect(
        page.getByRole("heading", { name: "Convex + Next.js" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Welcome!" }),
      ).toBeVisible();
    });
  });
});
