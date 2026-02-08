# Platform Overview

## Scope and Purpose

This document describes the main technologies, development tools, and development approach used in this project. It serves as a reference for understanding the technology stack, development environment setup, and workflow patterns.

## High-Level Summary

This platform is built on **Next.js 16** with **React 19** and **Convex** as the backend. Development uses **Cursor** as the primary development environment. Environment management is handled by **mise**, which manages Node.js and Python versions and provides task automation. The platform uses **TypeScript** throughout with **Tailwind CSS v4** for styling. Testing is handled by **Playwright** for end-to-end, visual regression, and accessibility testing.

## Frontend

### Next.js 16

The application is built on **Next.js 16** using the App Router architecture. Next.js provides server-side rendering, optimized routing, and seamless integration with React components.

### React 19

The frontend uses **React 19** for building interactive user interfaces. The application leverages both Server Components (default) and Client Components (for interactivity and real-time features).

### TypeScript

The entire codebase is written in **TypeScript** with strict mode enabled, providing type safety across both frontend and backend.

### Tailwind CSS v4

Styling is handled by **Tailwind CSS v4** using a CSS-first configuration approach. The design system uses CSS variables for theming and supports dark mode.

## Backend

### Convex

The backend is powered by **Convex**, a serverless platform that provides:

- Real-time database with automatic subscriptions
- Serverless functions (queries, mutations, and actions)
- Automatic TypeScript type generation from schema
- Built-in authentication support
- No database migrations needed (schema is code)

### Convex Functions

Backend logic is organized into Convex functions:

- **Queries**: Read operations that can be subscribed to reactively
- **Mutations**: Write operations that update the database
- **Actions**: Long-running operations or external API integrations

All functions are automatically type-safe based on the schema definition.

## Development Tools

### Cursor

Engineers use **Cursor** as the primary development environment. Cursor provides AI-powered code assistance and editing capabilities for building and maintaining the application.

### mise

Development environment management is handled by **mise** (formerly rtx), which manages Node.js and Python versions and provides task automation for common development operations.

The `mise.toml` file defines:

- Node.js and Python versions
- Environment variable loading from `.env.local`
- Setup task for installing dependencies and pre-commit hooks
- Pre-commit task for running code quality checks

Common development commands are executed via npm scripts in `package.json` rather than mise tasks, providing a consistent interface across different development environments.

### Playwright

End-to-end testing is handled by **Playwright**, which provides:

- **Visual Regression Testing**: Captures and compares screenshots in Chromium to detect unintended visual changes across desktop, tablet, and mobile viewports
- **Functional Testing**: Verifies user interactions, form submissions, navigation, and application behavior
- **Accessibility Testing**: Uses @axe-core/playwright to check WCAG 2.1 AA compliance, including keyboard navigation and skip links
- **Responsive Testing**: Tests layouts across multiple viewport sizes (mobile small/large, tablet portrait/landscape)
- **Database Snapshots**: Uses Convex's native export/import with HTTP health checks to ensure tests run with consistent data state
- **CI/CD Integration**: Automated test runs on pull requests with artifact uploads and PR comments

Tests run sequentially (workers: 1) with Chromium only to ensure predictable test order and database consistency for visual regression testing. The database state is automatically restored before tests using Convex export snapshots.

See [docs/testing.md](docs/testing.md) for comprehensive testing documentation and [docs/accessibility.md](docs/accessibility.md) for accessibility implementation details.

## Development Workflow

### Development Commands

Development commands are executed via npm scripts defined in `package.json`:

**Development:**

- `npm run dev` - Starts both frontend (Next.js) and backend (Convex) in parallel
- `npm run dev:local` - Configures Convex for local development deployment and starts dev servers
- `npm run dev:cloud` - Configures Convex for cloud development deployment and starts dev servers
- `npm run dev:frontend` - Starts only the Next.js development server
- `npm run dev:backend` - Starts only the Convex development server

**Build & Deploy:**

- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server

**Code Quality:**

- `npm run lint` - Runs ESLint for code quality checks

**Testing:**

- `npm run test:e2e` - Runs all Playwright E2E tests
- `npm run test:e2e:ui` - Opens Playwright UI for interactive test development
- `npm run test:e2e:headed` - Runs tests in headed mode (visible browser)
- `npm run test:e2e:debug` - Runs tests in debug mode
- `npm run test:e2e:report` - Opens the test results report
- `npm run test:e2e:update-snapshots` - Updates visual and database snapshots

### Development Process

The development process uses **Cursor** for implementing features, writing code, and managing the technical implementation. The platform is built with a focus on type safety, real-time capabilities, and modern web development practices.

### Code Quality

Pre-commit hooks are managed via mise and run automatically before commits. The `mise run pre-commit` task can be used to run all pre-commit hooks manually on all files.
