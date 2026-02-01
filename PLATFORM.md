# Platform Overview

This document describes the main technologies and development approach used in this project.

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

### Builder Fusion

Designers use **Builder Fusion** for creating and iterating on UI designs. The design system and components are developed collaboratively between engineers using Cursor and designers using Builder Fusion.

### mise

Development environment management is handled by **mise** (formerly rtx), which manages Node.js and Python versions and provides task automation for common development operations.

## Development Workflow

The development process combines:

- **Cursor** for engineers to implement features, write code, and manage the technical implementation
- **Builder Fusion** for designers to create UI designs and iterate on the user experience

This collaborative approach ensures that both the technical architecture and user experience are developed in parallel, with seamless integration between design and implementation.
