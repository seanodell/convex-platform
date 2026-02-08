---
description: Generate and update Playwright E2E tests based on page changes
---

# Test Command

Generate and update Playwright E2E tests for Next.js App Router pages with visual regression, functional, and accessibility testing.

## CRITICAL: Convention-Based Test Generation

**Page-to-Test Mapping Convention:**

```
app/page.tsx           → e2e/home.spec.ts
app/server/page.tsx    → e2e/server.spec.ts
app/about/page.tsx     → e2e/about.spec.ts
app/blog/[id]/page.tsx → e2e/blog-dynamic.spec.ts
```

## Workflow

### 1. Scan for All Pages

Find all `page.tsx` files in the app directory:

```bash
find app -name "page.tsx" -type f
```

### 2. Scan Existing Tests

Find all test files:

```bash
find e2e -name "*.spec.ts" -type f 2>/dev/null || echo "No tests found"
```

### 3. Detect Recent Changes

Check git diff to see what's been modified:

```bash
git diff HEAD --name-only -- app/
```

### 4. Analyze Each Page

For each page found, perform the following analysis by reading the page component code:

**Component Type Detection:**

- **Client Component** (`"use client"`): Uses Convex hooks, needs `convexReady` fixture, test loading states
- **Server Component** (async function, no `"use client"`): Uses `preloadQuery`, data immediately available, no loading state
- **Mixed** (server page importing client components): Test both patterns

**Interactive Elements to Test:**

- `<button onClick={...}>` → Click interaction test with mutation verification
- `<Link href="...">` → Navigation test with URL verification
- `<form onSubmit={...}>` → Form submission test
- `<input onChange={...}>` → Input interaction test
- Modal/popover state → Open/close/outside-click tests
- Radio buttons/checkboxes → Selection state tests
- Copy-to-clipboard → Clipboard API tests

**Data Dependencies:**

- `useQuery(api.*.*)` → Loading state test, real-time update test
- `useMutation(api.*.*)` → Mutation success test, data change verification
- `preloadQuery(api.*.*)` → SSR data test, immediate availability test
- `usePreloadedQuery(...)` → Hydration test, reactive updates test

**Visual Elements:**

- All pages → Light mode and dark mode snapshots
- Responsive layouts → Mobile and tablet viewport tests
- Interactive states → Popover/modal visual snapshots

### 5. Generate or Update Tests

For each page:

**If test file is MISSING:**

- Create new test file with complete coverage
- Include visual regression tests (light/dark mode)
- Include functional tests for all interactive elements
- Include accessibility tests
- Include responsive design tests
- Use `convexReady` fixture for client components
- Follow the test structure pattern (see below)

**If test file EXISTS but page CHANGED:**

- Read existing test file
- Analyze what changed in the page
- Update tests to match new behavior
- Add tests for new interactive elements
- Remove tests for removed elements
- Update visual snapshots if layout changed
- Preserve custom tests that developers added

**If test file EXISTS but page DELETED:**

- Report orphaned test
- Ask user if they want to delete the test file
- Do NOT delete automatically

### 6. Test Structure Pattern

Generate tests following this structure:

```typescript
import { test, expect } from "./fixtures/convex";
import { runAccessibilityTests } from "./fixtures/a11y";

test.describe("[Page Name] Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("[route]");
  });

  test.describe("Visual Regression", () => {
    test("matches visual snapshot - light mode", async ({ page, convexReady }) => {
      await page.emulateMedia({ colorScheme: "light" });
      // For client components: wait for loading to complete
      // await page.waitForSelector('text="Loading..."', { state: "hidden", timeout: 10000 });
      await expect(page).toHaveScreenshot("[page-name]-light.png", {
        fullPage: true,
      });
    });

    test("matches visual snapshot - dark mode", async ({ page, convexReady }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await expect(page).toHaveScreenshot("[page-name]-dark.png", {
        fullPage: true,
      });
    });
  });

  test.describe("Layout and Static Content", () => {
    test("displays [key elements]", async ({ page }) => {
      // Test static content visibility using getByRole, getByText
      await expect(page.getByRole("heading", { name: "..." })).toBeVisible();
    });
  });

  // For client components with useQuery:
  test.describe("Loading States", () => {
    test("displays loading state then content", async ({ page }) => {
      // Check for loading state (might be brief)
      const hasLoadingState = await page.getByText("Loading...").isVisible().catch(() => false);
      if (hasLoadingState) {
        await expect(page.getByText("Loading...")).toBeHidden({ timeout: 10000 });
      }
      // Verify content loaded
      await expect(page.getByRole("heading", { name: "..." })).toBeVisible();
    });
  });

  // For server components with preloadQuery:
  test.describe("Server-Side Rendering", () => {
    test("displays server-preloaded data immediately", async ({ page }) => {
      // Data should be visible immediately (no loading state)
      await expect(page.locator("...")).toBeVisible({ timeout: 1000 });
    });
  });

  test.describe("[Feature] Interactions", () => {
    test("[specific interaction]", async ({ page, convexReady }) => {
      // Test user interactions
      // Click buttons, fill forms, navigate, etc.
      const button = page.getByRole("button", { name: "..." });
      await button.click();
      // Verify result
      await expect(...).toPass({ timeout: 5000 });
    });
  });

  test.describe("Navigation", () => {
    test("navigates to [route]", async ({ page }) => {
      const link = page.getByRole("link", { name: "..." });
      await link.click();
      await expect(page).toHaveURL("[url]");
    });
  });

  test.describe("Accessibility", () => {
    test("has no accessibility violations", async ({ page, convexReady }) => {
      // For client components: wait for content to load
      // await page.waitForSelector('text="Loading..."', { state: "hidden", timeout: 10000 });
      await runAccessibilityTests(page);
    });

    test("can navigate with keyboard", async ({ page }) => {
      // Test keyboard navigation (Tab, Enter, Escape, etc.)
      await page.keyboard.press("Tab");
      await expect(page.getByRole("button", { name: "..." })).toBeFocused();
    });
  });

  test.describe("Responsive Design", () => {
    test("displays correctly on mobile viewport", async ({ page, convexReady }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.getByRole("heading", { name: "..." })).toBeVisible();
    });
  });
});
```

### 7. Guidelines for Test Generation

**Use Playwright Best Practices:**

- Use `getByRole`, `getByText`, `getByLabel` (semantic selectors)
- Avoid CSS selectors when possible
- Use `toBeVisible()`, `toHaveText()`, `toBeEnabled()` assertions
- Use `toPass()` with timeout for async state changes
- Use `toHaveScreenshot()` for visual regression

**Handle Convex Real-time Features:**

- For `useQuery`: Test loading state → loaded state transition
- For `useMutation`: Test button click → data update verification
- Use `convexReady` fixture to wait for Convex client initialization
- Use `waitForSelector` or `toPass()` for real-time updates

**Include Edge Cases:**

- Empty states ("No data" messages)
- Error states (network failures, validation errors)
- Loading states (client components)
- Immediate availability (server components)

**Accessibility Coverage:**

- Run axe-core checks on every page
- Test keyboard navigation for interactive elements
- Verify ARIA labels and semantic HTML
- Test with different color schemes (light/dark)

**Visual Regression:**

- Always test both light and dark mode
- Capture full-page screenshots
- Add specific snapshots for interactive states (modals, popovers)
- Use consistent viewport sizes

### 8. Mapping Pages to Test Files

**Implementation:**

```javascript
function pageToTestPath(pagePath) {
  // Root page: app/page.tsx → e2e/home.spec.ts
  if (pagePath === "app/page.tsx") {
    return "e2e/home.spec.ts";
  }

  // Nested pages: app/folder/page.tsx → e2e/folder.spec.ts
  const match = pagePath.match(/^app\/(.+?)\/page\.tsx$/);
  if (match) {
    let routeName = match[1];
    // Handle nested routes: app/blog/post/page.tsx → e2e/blog-post.spec.ts
    routeName = routeName.replace(/\//g, "-");
    // Handle dynamic routes: app/blog/[id]/page.tsx → e2e/blog-dynamic.spec.ts
    routeName = routeName.replace(/\[.*?\]/g, "dynamic");
    return `e2e/${routeName}.spec.ts`;
  }

  return null;
}
```

### 9. Report Results

After generating/updating tests, provide a summary:

```
✅ Test Generation Complete

Created:
  - e2e/about.spec.ts (new page: app/about/page.tsx)

Updated:
  - e2e/home.spec.ts (page modified: app/page.tsx)

Orphaned (page deleted, test remains):
  - e2e/old-page.spec.ts (page was: app/old/page.tsx)
    Run: rm e2e/old-page.spec.ts

Summary:
  - 2 test files up to date
  - 1 test file created
  - 1 test file updated
  - 1 orphaned test detected

Next steps:
  1. Review generated/updated tests
  2. Run tests: npm run test:e2e
  3. Generate snapshots: npm run test:e2e:update-snapshots (first time only)
  4. Commit changes
```

### 10. Important Notes

- **DO NOT** automatically delete test files - always ask the user
- **DO NOT** overwrite custom tests that developers added
- **DO** preserve the overall test structure when updating
- **DO** add comments explaining complex test logic
- **DO** follow existing code style (TypeScript, formatting)
- **DO** use the fixtures from `e2e/fixtures/` directory
- **DO** test both success and error paths when applicable

## Example Usage

### Scenario 1: New Page Created

```bash
# User creates new page
touch app/pricing/page.tsx
# ... implements page ...

# Run test command
/test

# Output:
# ✅ Created e2e/pricing.spec.ts
# Run: npm run test:e2e e2e/pricing.spec.ts
```

### Scenario 2: Existing Page Modified

```bash
# User modifies page
# ... edits app/page.tsx (adds new button) ...

# Run test command
/test

# Output:
# ✅ Updated e2e/home.spec.ts
# Added test for new "Subscribe" button interaction
# Run: npm run test:e2e e2e/home.spec.ts
```

### Scenario 3: Page Deleted

```bash
# User deletes page
rm app/old/page.tsx

# Run test command
/test

# Output:
# ⚠️  Orphaned test detected:
# e2e/old.spec.ts (page app/old/page.tsx no longer exists)
# Delete test? [y/N]
```

## Testing the Generated Tests

After generating tests, verify they work:

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Generate visual snapshots (first time only)
npm run test:e2e:update-snapshots

# Debug specific test
npm run test:e2e:debug e2e/home.spec.ts
```
