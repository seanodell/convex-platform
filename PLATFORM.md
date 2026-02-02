# Platform Overview

## Scope and Purpose

This document describes the main technologies, development tools, and development approach used in this project. It serves as a reference for understanding the technology stack, development environment setup, and workflow patterns.

## High-Level Summary

This platform is built on **Next.js 16** with **React 19** and **Convex** as the backend. Development uses **Cursor** as the primary development environment. Environment management is handled by **mise**, which manages Node.js and Python versions and provides task automation. The platform uses **TypeScript** throughout with **Tailwind CSS v4** for styling.

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

## Development Workflow

### Development Commands

Development commands are executed via npm scripts defined in `package.json`:

- `npm run dev` - Starts both frontend (Next.js) and backend (Convex) in parallel
- `npm run dev:local` - Configures Convex for local development deployment and starts dev servers
- `npm run dev:cloud` - Configures Convex for cloud development deployment and starts dev servers
- `npm run dev:frontend` - Starts only the Next.js development server
- `npm run dev:backend` - Starts only the Convex development server
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint for code quality checks

### Development Process

The development process uses **Cursor** for implementing features, writing code, and managing the technical implementation. The platform is built with a focus on type safety, real-time capabilities, and modern web development practices.

### Code Quality

Pre-commit hooks are managed via mise and run automatically before commits. The `mise run pre-commit` task can be used to run all pre-commit hooks manually on all files.
