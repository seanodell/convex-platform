# Convex Platform

[![Playwright Tests](https://github.com/seanodell/ConvexPlatform/actions/workflows/playwright.yml/badge.svg)](https://github.com/seanodell/ConvexPlatform/actions/workflows/playwright.yml)

## Scope and Purpose

This is the main project README that provides an overview of the Convex Platform project, quick start instructions, project structure, and links to detailed documentation. It serves as the entry point for developers getting started with the project.

## High-Level Summary

A full-stack development platform built with **Next.js 16**, **React 19**, and **Convex**, designed for building modern web applications with real-time capabilities. The platform uses TypeScript throughout, Tailwind CSS v4 for styling, and Cursor IDE with mise for development environment management.

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Convex (serverless database, real-time subscriptions, serverless functions)
- **Development**: Cursor IDE, mise (environment management)

## Quick Start

### Prerequisites

- Node.js (managed via mise)
- Python (managed via mise)
- A Convex account and project

### Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure Convex** (if not already configured):

   ```bash
   npx convex dev --configure
   ```

3. **Start development servers**:

   ```bash
   npm run dev
   ```

   This starts both the Next.js frontend and Convex backend in parallel.

### Development Modes

- `npm run dev` - Starts both frontend and backend (default)
- `npm run dev:local` - Configures for local Convex deployment and starts dev servers
- `npm run dev:cloud` - Configures for cloud Convex deployment and starts dev servers
- `npm run dev:frontend` - Starts only the Next.js development server
- `npm run dev:backend` - Starts only the Convex development server

## Project Structure

```
├── app/                    # Next.js App Router pages and components
├── components/             # Shared React components
├── convex/                # Convex backend functions and schema
│   ├── _generated/        # Auto-generated Convex types
│   ├── myFunctions.ts     # Backend functions (queries, mutations, actions)
│   └── schema.ts          # Database schema definition
├── public/                # Static assets
└── scripts/               # Utility scripts
```

## Development Workflow

This project uses **Cursor** as the primary development environment and **mise** for environment management. The `mise.toml` file configures Node.js and Python versions, environment variables, and development tasks.

### Code Quality

- Pre-commit hooks run automatically before commits
- ESLint is configured for TypeScript and React
- Run `npm run lint` to check code quality manually

### Testing

This project uses **Playwright** for end-to-end testing with visual regression, functional, and accessibility testing.

#### Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in headed mode (watch browser)
npm run test:e2e:headed

# View test report
npm run test:e2e:report

# Update visual snapshots (after intentional UI changes)
npm run test:e2e:update-snapshots
```

#### Automatic Test Generation

Use the `/test` command in Claude Code to automatically generate and update tests:

```bash
/test
```

The command will:

- Scan all pages in the `app/` directory
- Generate tests for pages without tests
- Update tests for modified pages
- Report orphaned tests for deleted pages

**Convention:** Each page automatically maps to a test file:

- `app/page.tsx` → `e2e/home.spec.ts`
- `app/about/page.tsx` → `e2e/about.spec.ts`

#### Pre-commit Hook

A pre-commit hook checks if modified pages have corresponding tests and warns (but doesn't block) if tests are missing. Run `/test` to sync tests with your changes.

#### CI/CD

Tests run automatically on all pull requests and pushes to `main`. View results in the GitHub Actions tab.

#### Learn More

See [docs/testing.md](docs/testing.md) for comprehensive testing documentation.

## Documentation

This project includes the following documentation files:

- **[PLATFORM.md](PLATFORM.md)** - Describes the main technologies, development tools, and development approach used in this project. Serves as a reference for understanding the technology stack, development environment setup, and workflow patterns.

- **[convex/README.md](convex/README.md)** - Contains Convex backend functions (queries, mutations, and actions) that handle server-side logic, database operations, and real-time data subscriptions. Provides guidance on writing Convex functions and using them in React components.

## Learn More

- [Convex Documentation](https://docs.convex.dev/) - Complete Convex API reference and guides
- [Convex Tour](https://docs.convex.dev/get-started) - Introduction to Convex principles
- [Stack](https://stack.convex.dev/) - Advanced articles and best practices
- [Convex Community](https://convex.dev/community) - Discord community for help and discussion
