import { execSync } from "child_process";
import { existsSync } from "fs";

const SNAPSHOT_PATH = "e2e/fixtures/data-snapshot.zip";

/**
 * Capture current database state using Convex's built-in export
 * Automatically captures ALL tables in your database
 * Run this when updating visual snapshots
 */
export async function captureDataSnapshot() {
  try {
    execSync(`npx convex export --path ${SNAPSHOT_PATH}`, {
      stdio: "inherit",
    });
    console.log(`[testData] Database snapshot captured to ${SNAPSHOT_PATH}`);
  } catch (error) {
    console.error("[testData] Failed to capture snapshot:", error);
    throw error;
  }
}

/**
 * Restore database from snapshot using Convex's built-in import
 * Automatically restores ALL tables from the snapshot
 * Run this before tests to ensure consistent data
 * @returns true if snapshot was restored, false if no snapshot exists
 */
export async function restoreDataSnapshot(): Promise<boolean> {
  if (!existsSync(SNAPSHOT_PATH)) {
    return false;
  }

  try {
    execSync(`npx convex import --replace ${SNAPSHOT_PATH} -y`, {
      stdio: "inherit",
    });
    console.log(`[testData] Database restored from ${SNAPSHOT_PATH}`);
    return true;
  } catch (error) {
    console.error("[testData] Failed to restore snapshot:", error);
    throw error;
  }
}
