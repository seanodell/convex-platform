import { test as setup } from "@playwright/test";
import { captureDataSnapshot, restoreDataSnapshot } from "../fixtures/testData";
import { readFileSync } from "fs";

/**
 * Wait for Convex to be ready by checking .env.local
 */
async function waitForConvex(maxAttempts = 20): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const envContent = readFileSync(".env.local", "utf-8");
      const match = envContent.match(/CONVEX_URL=(.+)/);
      if (match) {
        return match[1].trim();
      }
    } catch {
      // File doesn't exist yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return null;
}

/**
 * Database setup - runs AFTER webServer is ready
 * - In capture mode (CAPTURE_SNAPSHOT=true): Captures current database state
 * - In restore mode (default): Restores database from snapshot
 */
setup("prepare database", async () => {
  const captureMode = process.env.CAPTURE_SNAPSHOT === "true";

  // Wait for Convex to be ready
  console.log("\n⏳ Waiting for Convex backend to be ready...");
  const convexUrl = await waitForConvex();

  if (!convexUrl) {
    console.warn("⚠️  Convex backend not ready - skipping database setup\n");
    return;
  }

  // Set the URL in the environment so testData functions can use it
  process.env.CONVEX_URL = convexUrl;

  // Wait a bit longer for the server to actually accept connections
  console.log("⏳ Waiting for Convex server to accept connections...");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("✓ Convex backend ready\n");

  if (captureMode) {
    console.log("📸 CAPTURE MODE: Saving current database state...");
    try {
      await captureDataSnapshot();
      console.log("✓ Database snapshot captured to data-snapshot.zip\n");
    } catch (error) {
      console.error("✗ Failed to capture database snapshot:", error);
      // Continue anyway - visual snapshots can still be updated
    }
  } else {
    console.log("🔄 RESTORE MODE: Loading database from snapshot...");
    try {
      const restored = await restoreDataSnapshot();
      if (restored) {
        console.log("✓ Database state restored from snapshot\n");
      } else {
        console.warn(
          "⚠️  No snapshot found - tests may have inconsistent data",
        );
        console.warn(
          "   Run 'npm run test:e2e:update-snapshots' to create initial snapshot\n",
        );
      }
    } catch (error) {
      console.error("✗ Failed to restore database snapshot:", error);
      // Don't fail - tests might still work
    }
  }
});
