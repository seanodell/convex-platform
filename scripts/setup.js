#!/usr/bin/env node

/**
 * Setup script for Convex + Next.js development
 * 
 * This script ensures the project is properly configured before running.
 * It checks for required environment variables and files.
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const envLocalPath = path.join(projectRoot, ".env.local");

console.log("🚀 Setting up Convex + Next.js project...\n");

// Check if .env.local exists
if (!fs.existsSync(envLocalPath)) {
  console.log(
    "ℹ️  .env.local not found. Convex will create it on first run.\n"
  );
  console.log("📝 When you first run `npm run dev`, Convex will:");
  console.log("   1. Create a local deployment");
  console.log("   2. Generate .env.local with the correct configuration");
  console.log("   3. Start both frontend and backend servers\n");
} else {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  if (!envContent.includes("NEXT_PUBLIC_CONVEX_URL")) {
    console.warn(
      "⚠️  NEXT_PUBLIC_CONVEX_URL not found in .env.local!\n" +
        "This may cause connection issues between frontend and backend."
    );
  } else {
    console.log("✅ .env.local is properly configured\n");
  }
}

// Check package.json
const packageJsonPath = path.join(projectRoot, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

if (packageJson.scripts?.dev) {
  console.log("📦 Available scripts:\n");
  console.log("   npm run dev              - Run frontend and backend together (recommended)");
  console.log("   npm run dev:frontend     - Run only Next.js frontend");
  console.log("   npm run dev:backend      - Run only Convex backend");
  console.log("   npm run build            - Build for production");
  console.log("   npm run lint             - Check code with ESLint\n");
}

console.log("✨ Setup complete! You're ready to develop.\n");
console.log("📌 Next steps:");
console.log("   1. Run: npm run dev");
console.log("   2. Open: http://localhost:3000");
console.log("   3. Start building!\n");
console.log("📚 For help, see README.md or https://docs.convex.dev\n");
