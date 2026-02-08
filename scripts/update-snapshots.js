#!/usr/bin/env node

/**
 * Update visual snapshots and capture database state
 *
 * This script runs Playwright with a special environment variable
 * that tells the global setup to capture (instead of restore) the snapshot.
 *
 * Usage: npm run test:e2e:update-snapshots
 */

const { execSync } = require("child_process");
const path = require("path");

async function main() {
  console.log("📸 Updating visual snapshots and capturing database state...\n");

  try {
    // Set environment variable to tell global setup to capture instead of restore
    const env = { ...process.env, CAPTURE_SNAPSHOT: "true" };

    execSync("npx playwright test --update-snapshots", {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
      env,
    });

    console.log("\n✓ Visual snapshots updated");
    console.log("✓ Database state captured");
    console.log(
      "\n💡 Both database state and visual snapshots are now synchronized",
    );
  } catch (error) {
    console.error("\n✗ Update failed");
    process.exit(1);
  }
}

main();
