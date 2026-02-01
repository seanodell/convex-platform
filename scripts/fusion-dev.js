#!/usr/bin/env node

/**
 * Fusion Development Server
 * 
 * This script is designed specifically for Builder Fusion environments.
 * It starts both the Convex backend and Next.js frontend in the correct order,
 * ensuring proper communication between them.
 * 
 * Designers and developers: just run this and visit http://localhost:3000
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

console.log("🚀 Starting Convex + Next.js for Fusion...\n");
console.log("This will start:");
console.log("  • Convex backend (http://127.0.0.1:3210)");
console.log("  • Next.js frontend (http://localhost:3000)\n");

// Track if Convex is ready
let convexReady = false;
const convexReadyIndicators = [
  "Convex functions ready",
  "Started running a deployment locally",
];

/**
 * Start Convex backend first
 */
console.log("⚙️  Starting Convex backend...");
const convexProcess = spawn("npm", ["run", "dev:backend"], {
  cwd: projectRoot,
  stdio: ["ignore", "pipe", "pipe"],
});

convexProcess.stdout.on("data", (data) => {
  const output = data.toString();
  
  // Check if Convex is ready
  if (
    !convexReady &&
    convexReadyIndicators.some((indicator) => output.includes(indicator))
  ) {
    convexReady = true;
    console.log("✅ Convex backend is ready\n");
    
    // Now start the frontend
    startFrontend();
  }
  
  // Optionally log important messages
  if (output.includes("error") || output.includes("Error")) {
    console.log("[Convex]", output.trim());
  }
});

convexProcess.stderr.on("data", (data) => {
  const output = data.toString();
  if (output.includes("error") || output.includes("Error")) {
    console.error("[Convex Error]", output.trim());
  }
});

convexProcess.on("error", (err) => {
  console.error("❌ Failed to start Convex backend:", err.message);
  process.exit(1);
});

/**
 * Start Next.js frontend (called after Convex is ready)
 */
function startFrontend() {
  console.log("📱 Starting Next.js frontend...");
  
  const nextProcess = spawn("npm", ["run", "dev:frontend"], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  nextProcess.on("error", (err) => {
    console.error("❌ Failed to start Next.js frontend:", err.message);
    convexProcess.kill();
    process.exit(1);
  });

  nextProcess.on("close", (code) => {
    console.log("Next.js frontend exited with code", code);
    convexProcess.kill();
    process.exit(code);
  });

  // Handle signals
  process.on("SIGINT", () => {
    console.log("\n\nShutting down servers...");
    nextProcess.kill();
    convexProcess.kill();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    nextProcess.kill();
    convexProcess.kill();
    process.exit(0);
  });
}
