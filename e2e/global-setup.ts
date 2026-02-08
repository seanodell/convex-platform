import { captureDataSnapshot, restoreDataSnapshot } from "./fixtures/testData";

/**
 * Global setup runs once before all tests
 * - In normal mode: Restores database from snapshot
 * - In capture mode (CAPTURE_SNAPSHOT=true): Captures current database state
 */
async function globalSetup() {
  const captureMode = process.env.CAPTURE_SNAPSHOT === "true";

  if (captureMode) {
    console.log("Running in CAPTURE mode - saving current database state...");
    try {
      await captureDataSnapshot();
      console.log("✓ Database snapshot captured to data-snapshot.json");
    } catch (error) {
      console.error("✗ Failed to capture database snapshot:", error);
      // Continue anyway - visual snapshots can still be updated
    }
  } else {
    console.log("Running in RESTORE mode - loading database from snapshot...");
    try {
      const restored = await restoreDataSnapshot();
      if (restored) {
        console.log("✓ Database state restored from snapshot");
      } else {
        console.warn(
          "⚠️  No snapshot found - tests may have inconsistent data",
        );
        console.warn(
          "   Run 'npm run test:e2e:update-snapshots' to create initial snapshot",
        );
      }
    } catch (error) {
      console.error("✗ Failed to restore database snapshot:", error);
      // Don't fail setup - tests might still work
    }
  }
}

export default globalSetup;
