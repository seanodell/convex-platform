import { Page } from "@playwright/test";
import { injectAxe, checkA11y, configureAxe } from "@axe-core/playwright";

/**
 * Run accessibility checks on a page
 * @param page - Playwright page object
 * @param options - Configuration options for axe
 */
export async function runAccessibilityTests(
  page: Page,
  options: {
    includeTags?: string[];
    excludeRules?: string[];
  } = {},
) {
  // Inject axe-core into the page
  await injectAxe(page);

  // Configure axe if needed
  if (options.includeTags || options.excludeRules) {
    await configureAxe(page, {
      rules: options.excludeRules?.map((rule) => ({
        id: rule,
        enabled: false,
      })),
    });
  }

  // Run accessibility checks
  // This will throw an error if violations are found
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
}

/**
 * Common WCAG 2.1 Level AA tags
 */
export const WCAG_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/**
 * Rules that might be too strict for development
 * (can be excluded if needed)
 */
export const COMMON_EXCLUDED_RULES = [
  // "color-contrast", // Uncomment if contrast ratios are intentionally lower
];
