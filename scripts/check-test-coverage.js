#!/usr/bin/env node

/**
 * Pre-commit hook to check if modified pages have corresponding E2E tests
 * This script warns if tests are missing but does NOT block commits
 */

const fs = require("fs");
const path = require("path");

/**
 * Map page file path to expected test file path
 * Following the convention from .claude/commands/test.md
 *
 * @param {string} pagePath - Path to page.tsx file
 * @returns {string|null} - Path to expected test file, or null if not a page file
 */
function pageToTestPath(pagePath) {
  // Normalize path separators
  pagePath = pagePath.replace(/\\/g, "/");

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

/**
 * Check if a test file exists
 *
 * @param {string} testPath - Path to test file
 * @returns {boolean} - True if test exists
 */
function testFileExists(testPath) {
  try {
    return fs.existsSync(testPath);
  } catch (error) {
    return false;
  }
}

/**
 * Get last modified time of a file
 *
 * @param {string} filePath - Path to file
 * @returns {number} - Timestamp in milliseconds, or 0 if file doesn't exist
 */
function getLastModifiedTime(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtimeMs;
  } catch (error) {
    return 0;
  }
}

/**
 * Check if test file is potentially stale (page modified after test)
 *
 * @param {string} pagePath - Path to page file
 * @param {string} testPath - Path to test file
 * @returns {boolean} - True if test might be stale
 */
function isTestStale(pagePath, testPath) {
  const pageTime = getLastModifiedTime(pagePath);
  const testTime = getLastModifiedTime(testPath);

  // If test doesn't exist, it's definitely stale
  if (testTime === 0) {
    return true;
  }

  // If page was modified more recently than test, test might be stale
  // Add 1 second buffer to account for file system timing
  return pageTime > testTime + 1000;
}

/**
 * Main function
 */
function main() {
  const changedPages = process.argv.slice(2);

  if (changedPages.length === 0) {
    // No page files changed, exit successfully
    process.exit(0);
  }

  const missingTests = [];
  const staleTests = [];

  for (const pagePath of changedPages) {
    const testPath = pageToTestPath(pagePath);

    if (!testPath) {
      // Not a page file we track, skip it
      continue;
    }

    if (!testFileExists(testPath)) {
      missingTests.push({ page: pagePath, test: testPath, status: "missing" });
    } else if (isTestStale(pagePath, testPath)) {
      staleTests.push({ page: pagePath, test: testPath, status: "stale" });
    }
  }

  // Report findings
  if (missingTests.length > 0 || staleTests.length > 0) {
    console.log("\n⚠️  E2E Test Coverage Warning\n");

    if (missingTests.length > 0) {
      console.log("Missing tests for modified pages:");
      for (const { page, test } of missingTests) {
        console.log(`  ${page} → ${test} (not found)`);
      }
    }

    if (staleTests.length > 0) {
      if (missingTests.length > 0) console.log("");
      console.log("Potentially outdated tests:");
      for (const { page, test } of staleTests) {
        console.log(`  ${page} → ${test} (modified after test)`);
      }
    }

    console.log("\nRun the /test command to sync tests with your changes:");
    console.log("  /test\n");
    console.log("Or manually create/update tests as needed.\n");

    // Exit successfully (0) to NOT block the commit
    // This is intentional - we want to warn but not prevent commits
    process.exit(0);
  }

  // All tests are up to date
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { pageToTestPath, testFileExists, isTestStale };
