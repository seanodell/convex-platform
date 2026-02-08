import { Page, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
  // Build axe configuration
  let axeBuilder = new AxeBuilder({ page });

  // Add tags if specified
  if (options.includeTags && options.includeTags.length > 0) {
    axeBuilder = axeBuilder.withTags(options.includeTags);
  }

  // Disable specific rules if specified
  if (options.excludeRules && options.excludeRules.length > 0) {
    axeBuilder = axeBuilder.disableRules(options.excludeRules);
  }

  // Run accessibility checks
  const accessibilityScanResults = await axeBuilder.analyze();

  // Assert no violations found
  expect(accessibilityScanResults.violations).toEqual([]);
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
