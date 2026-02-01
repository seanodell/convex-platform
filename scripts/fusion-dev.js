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

console.log("🚀 Starting Convex + Next.js...\n");

// Track if Convex is ready
let convexReady = false;
let frontendStarted = false;

/**
 * Start Convex backend first
 */
const convexProcess = spawn("npm", ["run", "dev:backend"], {
  cwd: projectRoot,
  stdio: ["ignore", "pipe", "pipe"],
});

convexProcess.stdout.on("data", (data) => {
  const output = data.toString();
  
  // Check if Convex is ready
  if (
    !convexReady &&
    (output.includes("Convex functions ready") ||
      output.includes("Started running a deployment"))
  ) {
    convexReady = true;
    if (!frontendStarted) {
      startFrontend();
    }
  }
});

convexProcess.on("error", (err) => {
  console.error("❌ Convex error:", err.message);
  process.exit(1);
});

/**
 * Start Next.js frontend (called after Convex is ready)
 */
function startFrontend() {
  frontendStarted = true;
  
  const nextProcess = spawn("npm", ["run", "dev:frontend"], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  nextProcess.on("error", (err) => {
    console.error("❌ Next.js error:", err.message);
    convexProcess.kill();
    process.exit(1);
  });

  nextProcess.on("close", (code) => {
    convexProcess.kill();
    process.exit(code || 0);
  });

  // Handle shutdown
  process.on("SIGINT", () => {
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
