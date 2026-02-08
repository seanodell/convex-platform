# E2E Testing Guide

This project uses [Playwright](https://playwright.dev/) for end-to-end testing with visual regression, functional, and accessibility testing.

## Table of Contents

- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Automatic Test Generation](#automatic-test-generation)
- [Visual Regression Testing](#visual-regression-testing)
- [Accessibility Testing](#accessibility-testing)
- [Debugging Tests](#debugging-tests)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Quick Start

### First Time Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Generate initial visual snapshots
npm run test:e2e:update-snapshots
```

### Running Your First Tests

```bash
# Run all tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in headed mode (watch browser)
npm run test:e2e:headed
```

## Running Tests

### Available Commands

```bash
# Run all tests (headless, all browsers)
npm run test:e2e

# Run tests with UI (best for development)
npm run test:e2e:ui

# Run tests in headed mode (watch browser execution)
npm run test:e2e:headed

# Debug tests (step-by-step execution)
npm run test:e2e:debug

# View test report
npm run test:e2e:report

# Update visual snapshots (after intentional UI changes)
npm run test:e2e:update-snapshots
```

### Running Specific Tests

```bash
# Run a specific test file
npx playwright test e2e/home.spec.ts

# Run tests matching a pattern
npx playwright test home

# Run a specific test by name
npx playwright test -g "displays header"

# Tests run in Chromium only (default configuration)
npx playwright test --project=chromium
```

## Writing Tests

### Test Structure

Tests follow this structure:

```typescript
import { test, expect } from "./fixtures/convex";
import { runAccessibilityTests } from "./fixtures/a11y";

test.describe("Page Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/route");
  });

  test("test description", async ({ page, convexReady }) => {
    // Test implementation
  });
});
```

### Using Fixtures

#### Convex Ready Fixture

For pages that load data from Convex, use the `convexReady` fixture:

```typescript
test("loads data from Convex", async ({ page, convexReady }) => {
  // convexReady ensures Convex client is initialized
  // Wait for loading state to complete
  await page.waitForSelector('text="Loading..."', {
    state: "hidden",
    timeout: 10000,
  });

  // Now test your data
  await expect(page.getByText("Your Data")).toBeVisible();
});
```

#### Accessibility Testing

```typescript
import { runAccessibilityTests } from "./fixtures/a11y";

test("has no accessibility violations", async ({ page }) => {
  await runAccessibilityTests(page);
});
```

### Selectors Best Practices

Prefer semantic selectors over CSS selectors:

```typescript
// ✅ Good - Use role-based selectors
await page.getByRole("button", { name: "Submit" });
await page.getByRole("heading", { name: "Welcome" });
await page.getByRole("link", { name: "About" });

// ✅ Good - Use text content
await page.getByText("Welcome to our site");
await page.getByLabel("Email address");

// ❌ Avoid - CSS selectors are brittle
await page.locator(".btn-primary");
await page.locator("#submit-button");
```

### Testing Interactions

```typescript
test("submits form successfully", async ({ page, convexReady }) => {
  // Click a button
  await page.getByRole("button", { name: "Submit" }).click();

  // Fill a form
  await page.getByLabel("Email").fill("test@example.com");

  // Navigate
  await page.getByRole("link", { name: "Next Page" }).click();
  await expect(page).toHaveURL("/next-page");

  // Wait for real-time updates
  await expect(async () => {
    const text = await page.locator("...").textContent();
    expect(text).toContain("Updated");
  }).toPass({ timeout: 5000 });
});
```

### Testing Convex Real-time Features

```typescript
test("updates data in real-time", async ({ page, convexReady }) => {
  // Get initial state
  const dataDisplay = page.locator('[data-testid="data"]');
  const beforeText = await dataDisplay.textContent();

  // Trigger mutation
  await page.getByRole("button", { name: "Add Item" }).click();

  // Wait for real-time update
  await expect(async () => {
    const afterText = await dataDisplay.textContent();
    expect(afterText).not.toBe(beforeText);
  }).toPass({ timeout: 5000 });
});
```

## Automatic Test Generation

### Using the /test Command

The `/test` command automatically generates and updates tests based on your page changes:

```bash
# In Claude Code, run:
/test
```

**What it does:**

1. Scans all `page.tsx` files in `app/` directory
2. Maps each page to a test file using convention:
   - `app/page.tsx` → `e2e/home.spec.ts`
   - `app/about/page.tsx` → `e2e/about.spec.ts`
3. Detects changes via git diff
4. Creates missing test files
5. Updates existing tests when pages change
6. Reports orphaned tests when pages are deleted

**When to use:**

- After creating a new page
- After modifying page functionality
- After adding/removing interactive elements
- Periodically to keep tests in sync

### Test Generation Convention

The command follows this mapping:

```
app/page.tsx           → e2e/home.spec.ts
app/server/page.tsx    → e2e/server.spec.ts
app/about/page.tsx     → e2e/about.spec.ts
app/blog/[id]/page.tsx → e2e/blog-dynamic.spec.ts
```

### Pre-commit Hook

A pre-commit hook checks if your changed pages have corresponding tests:

```bash
git add app/page.tsx
git commit -m "feat: add new feature"

# Output:
# ⚠️  Warning: app/page.tsx modified but e2e/home.spec.ts not updated
# Run /test to sync tests with your changes
```

The hook **warns** but **does not block** commits.

## Visual Regression Testing

### Capturing Screenshots

Visual regression tests capture screenshots and compare them across runs in Chromium:

```typescript
test("matches visual snapshot", async ({ page }) => {
  await expect(page).toHaveScreenshot("page-name.png", {
    fullPage: true,
  });
});
```

### Testing Light and Dark Mode

```typescript
test("light mode snapshot", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page).toHaveScreenshot("page-light.png");
});

test("dark mode snapshot", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page).toHaveScreenshot("page-dark.png");
});
```

### Testing Responsive Layouts

Test pages across multiple viewport sizes to ensure responsive design works correctly:

```typescript
test("mobile small - visual snapshot", async ({ page, convexReady }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  await expect(page).toHaveScreenshot("page-mobile-small.png");
});

test("mobile large - visual snapshot", async ({ page, convexReady }) => {
  await page.setViewportSize({ width: 414, height: 896 }); // iPhone 14 Pro Max
  await expect(page).toHaveScreenshot("page-mobile-large.png");
});

test("tablet - visual snapshot", async ({ page, convexReady }) => {
  await page.setViewportSize({ width: 768, height: 1024 }); // iPad portrait
  await expect(page).toHaveScreenshot("page-tablet.png");
});

test("tablet landscape - visual snapshot", async ({ page, convexReady }) => {
  await page.setViewportSize({ width: 1024, height: 768 }); // iPad landscape
  await expect(page).toHaveScreenshot("page-tablet-landscape.png");
});
```

### Updating Snapshots

When you intentionally change the UI, you need to update **both** visual snapshots and database snapshots together:

```bash
# Update all snapshots (RECOMMENDED - captures both visual and database state)
npm run test:e2e:update-snapshots

# Update specific test snapshots (advanced - use with caution)
npx playwright test --update-snapshots e2e/home.spec.ts
```

**What happens when you run `npm run test:e2e:update-snapshots`:**

1. **Captures database state** - Uses Convex's built-in `convex export` to snapshot **all tables** to `e2e/fixtures/data-snapshot.zip`
2. **Updates visual snapshots** - Runs Playwright with `--update-snapshots` flag
3. **Synchronizes both** - Ensures visual snapshots match the exact database state

The snapshot system uses **Convex's native export/import** - it automatically captures all tables in your database, so adding new tables to your schema requires no test configuration changes.

**Why this matters:** Visual regression tests need consistent data. By capturing the database state at the same time as visual snapshots, every test run starts with the exact same data, eliminating flakiness caused by data variations.

**Workflow:**

```bash
# 1. Set up your database to the desired state
#    (add/remove data as needed for good test coverage)

# 2. Update snapshots - captures BOTH database and visual state
npm run test:e2e:update-snapshots

# 3. Commit both the visual snapshots and data-snapshot.zip
git add e2e/ -A
git commit -m "test: update visual and data snapshots"

# 4. All future test runs restore this exact database state
npm run test:e2e
```

**Advanced:** If you only want to update visual snapshots for a specific test without capturing database state:

```bash
# Skip database capture (use existing snapshot)
npx playwright test --update-snapshots e2e/home.spec.ts
```

### Reviewing Visual Differences

When visual tests fail:

1. Run `npm run test:e2e:report`
2. Open the HTML report
3. View the diff between expected and actual screenshots
4. If change is intentional: update snapshots
5. If change is a bug: fix the issue

### Database State and Data Isolation

**How it works:**

Every test run starts with **identical database state** by restoring from a snapshot:

1. **Before tests start** - Setup project runs, waits for Convex backend to accept connections via HTTP health checks, then restores database from `e2e/fixtures/data-snapshot.zip`
2. **Tests execute sequentially** - Tests run one at a time with a single worker to ensure data consistency
3. **Visual snapshots match** - Screenshots are consistent because data is consistent

**Backend Health Checks:**

The test setup uses HTTP health checks (`waitForConvexBackend()`) instead of fixed delays to ensure the Convex backend is actually ready to accept connections before attempting database operations. This makes test startup more reliable and responsive.

**Why sequential execution?**

Tests run with `workers: 1` and `fullyParallel: false` to ensure:

- Tests always run in the same order
- Database state is predictable (tests can add/modify data)
- Visual regression tests see consistent data
- No race conditions between parallel tests

This makes tests slightly slower but much more reliable and maintainable.

**When to update the database snapshot:**

- When you add/remove data that affects visual appearance
- When you update visual snapshots (automatically handled)
- When you want to change the baseline test data

**Snapshot Format:**

The snapshot uses Convex's native export format (ZIP file) containing:

- One directory per table
- Each table has a `documents.jsonl` file with all documents
- Automatically includes all tables in your database

**Adding New Tables:**

When you create a new Convex table, it's **automatically included** in snapshots. Just run:

```bash
npm run test:e2e:update-snapshots
```

No configuration needed! The Convex export automatically discovers and captures all tables.

**Manual database snapshot management:**

```typescript
// In your test or setup script
import {
  captureDataSnapshot,
  restoreDataSnapshot,
} from "./e2e/fixtures/testData";

// Capture current database state
await captureDataSnapshot();

// Restore database from snapshot
await restoreDataSnapshot();
```

**Important:** The snapshot captures whatever is in your database at the time. This lets you develop a realistic dataset over time rather than using artificial seed data.

**Troubleshooting:**

If tests pass locally but fail in CI with visual differences, check:

1. Is `e2e/fixtures/data-snapshot.zip` committed to git?
2. Did you run `npm run test:e2e:update-snapshots` to capture both states together?
3. Are tests modifying the database without cleanup?

## Accessibility Testing

### Running A11y Tests

All pages are tested for WCAG 2.1 Level AA compliance using @axe-core/playwright:

```typescript
import { runAccessibilityTests } from "./fixtures/a11y";

test("has no accessibility violations", async ({ page }) => {
  await runAccessibilityTests(page);
});
```

The test suite automatically checks for accessibility violations including skip navigation, keyboard focus, color contrast, and semantic HTML. See [docs/accessibility.md](accessibility.md) for detailed information about the accessibility features implemented in this project.

### Common A11y Issues

The tests check for:

- Color contrast ratios (WCAG AA: 4.5:1 for normal text)
- ARIA labels and roles
- Semantic HTML structure
- Keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- Focus management and skip links
- Alt text for images
- Form label associations

### Testing Keyboard Navigation

Tests verify that keyboard users can navigate effectively:

```typescript
test("can navigate with keyboard", async ({ page, convexReady }) => {
  // First Tab focuses skip link (accessibility feature)
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();

  // Second Tab focuses next interactive element
  await page.keyboard.press("Tab");
  const button = page.getByRole("button", { name: "Submit" });
  await expect(button).toBeFocused();
});
```

### Excluding Specific Rules

If you need to exclude certain rules temporarily:

```typescript
import { runAccessibilityTests, COMMON_EXCLUDED_RULES } from "./fixtures/a11y";

test("has no critical a11y violations", async ({ page }) => {
  await runAccessibilityTests(page, {
    excludeRules: ["color-contrast"], // Temporarily exclude
  });
});
```

## Debugging Tests

### Using Playwright UI Mode

The best way to debug tests:

```bash
npm run test:e2e:ui
```

Features:

- Watch test execution in real-time
- Step through test actions
- Inspect DOM at each step
- View console logs and network requests
- Time-travel debugging

### Using Debug Mode

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### Using console.log

```typescript
test("debug example", async ({ page }) => {
  const element = page.getByRole("button");

  // Log element state
  console.log("Element visible:", await element.isVisible());
  console.log("Element text:", await element.textContent());

  // Pause execution
  await page.pause(); // Opens Inspector
});
```

### Viewing Test Reports

After test runs:

```bash
npm run test:e2e:report
```

The report shows:

- Test results (passed/failed)
- Execution time
- Screenshots and videos (on failure)
- Console logs
- Network activity

## CI/CD Integration

### GitHub Actions

Tests run automatically on:

- All pull requests
- Pushes to `main` branch

Workflow location: `.github/workflows/playwright.yml`

### What CI Tests Do

1. Install dependencies and Playwright browsers
2. Start Convex dev backend
3. Run full test suite in Chromium (including visual regression, functional, accessibility, and responsive tests)
4. Capture screenshots and videos on failure
5. Upload test reports as artifacts
6. Comment results on pull requests

### Viewing CI Results

- Check the "Actions" tab in GitHub
- View test reports in PR comments
- Download artifacts for detailed investigation

### Secrets Required

The CI workflow needs:

- `CONVEX_DEPLOYMENT` - Set in GitHub repository secrets

## Best Practices

### Test Organization

```
e2e/
├── fixtures/          # Reusable test utilities
│   ├── convex.ts     # Convex-specific fixtures
│   └── a11y.ts       # Accessibility utilities
├── home.spec.ts      # Tests for home page
├── server.spec.ts    # Tests for server page
└── ...               # One test file per page
```

### Writing Maintainable Tests

1. **Use semantic selectors** - Prefer `getByRole` over CSS selectors
2. **Wait for conditions** - Use `expect().toPass()` for async operations
3. **Test user flows** - Test what users do, not implementation details
4. **Keep tests independent** - Each test should run in isolation
5. **Use fixtures** - Reuse common setup logic
6. **Add descriptive names** - Test names should explain what they verify

### Performance Tips

1. **Run tests in parallel** - Playwright does this by default
2. **Use `test.describe.configure({ mode: 'parallel' })`** - For test groups
3. **Avoid unnecessary waits** - Use smart waiting strategies
4. **Skip slow tests during development** - Use `test.skip()` temporarily

### Common Patterns

#### Testing Forms

```typescript
test("submits form", async ({ page }) => {
  await page.getByLabel("Name").fill("John Doe");
  await page.getByLabel("Email").fill("john@example.com");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("Success!")).toBeVisible();
});
```

#### Testing Navigation

```typescript
test("navigates to page", async ({ page }) => {
  await page.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL("/about");
  await expect(page.getByRole("heading", { name: "About Us" })).toBeVisible();
});
```

#### Testing Error States

```typescript
test("shows error message", async ({ page }) => {
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Error: field required")).toBeVisible();
});
```

## Troubleshooting

### Tests Timeout

If tests timeout waiting for Convex:

```typescript
// Increase timeout for Convex-heavy tests
test("loads lots of data", async ({ page, convexReady }) => {
  test.setTimeout(60000); // 60 seconds

  await page.waitForSelector('text="Loading..."', {
    state: "hidden",
    timeout: 30000, // 30 seconds
  });
});
```

### Visual Tests Fail Inconsistently

- Ensure consistent viewport sizes
- Wait for animations to complete
- Disable CSS animations in test mode (if needed)
- Use `maxDiffPixels` and `threshold` in config

### Can't Find Elements

```typescript
// Debug selector issues
await page.screenshot({ path: "debug.png" });
console.log(await page.content()); // Print HTML
await page.pause(); // Open Inspector
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Convex Testing Guide](https://docs.convex.dev/testing)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Axe Accessibility Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
