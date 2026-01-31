# Platform Architecture & Stack Description

This document describes the platform architecture, technology stack, and development workflows for rebuilding this application foundation. It focuses on infrastructure, patterns, and processes rather than product-specific features.

## How to Use This Document

**This document is a complete specification for building a Convex-based platform. Follow it step-by-step, prompting the user when needed.**

### Your Role as the LLM

- Read this entire document before starting
- Follow the Implementation Guide phases in order
- Automatically set up Phase 1: initialize git, commit doc, set up mise, set up Convex tutorial project in child folder and move up, test, and commit
- **CRITICAL**: Never ignore errors - if any command or step produces errors, STOP and fix them before proceeding
- **CRITICAL**: Do not skip commits - each phase must be committed before moving to the next
- Test each phase before proceeding
- Commit changes after each phase completes successfully
- Ask the user for preferences when choices are needed (e.g., which ShadCN components to install)
- Reference the detailed architecture patterns when implementing features
- Do not skip steps or phases
- Verify syntax correctness (e.g., TOML syntax for mise.toml) before running commands

### When to Prompt the User

- **Phase 1**: Automatically initialize git, set up mise, and set up Convex tutorial project, but confirm it works before proceeding
- **Prerequisites**: Check if mise is installed (git will be initialized in Phase 1, Node.js will be installed via mise)
- **Component choices**: Ask which ShadCN components to install initially
- **Configuration**: Ask for any user preferences (e.g., theme colors, font choices)
- **Issues**: If something doesn't work, explain the issue and ask how to proceed
- **Completion**: Confirm each phase is complete before moving forward

## Technology Stack

### Core Framework

- **Next.js 16** with App Router architecture
- Server Components as the default rendering strategy
- Client Components for interactive features with Convex hooks
- TypeScript with strict mode enabled

### Frontend Design System

- **ShadCN UI** - Copy-paste component library (not an npm dependency)
- Components stored in `components/ui/` directory
- Built on Radix UI primitives for accessibility
- **Tailwind CSS v4** - CSS-first configuration approach
- Theme system based on CSS variables with automatic Tailwind utility mapping
- Font system using Next.js font optimization API
- Theme preferences stored in Convex database for user persistence

### Backend & Database

- **Convex** - Serverless backend with real-time database and built-in API
- Convex functions provide data operations (queries, mutations, actions)
- Real-time subscriptions via React hooks
- Automatic TypeScript type generation from schema
- Schema defined in code
- Authentication via `@convex-dev/auth` library

### Validation & Type Safety

- **Convex Schema** - Defines database structure and validates at database level
- **Convex Validators** - Validate function arguments and data on the server
- Convex automatically generates TypeScript types from schema
- Convex validators provide server-side validation for mutations and queries
- Validation happens within the mutation transaction (no separate round-trip)
- Real-time WebSocket updates provide immediate feedback on validation results
- Type safety ensures consistency across all layers
- **As-you-type validation**: Validation logic defined as pure TypeScript functions
- Pure validation functions work on both client and server
- Client-side: Functions called during form input for immediate feedback
- Server-side: Same functions called in Convex mutations for data integrity
- Single source of truth for validation rules

### Development Environment

- **mise** (formerly rtx) - Development environment manager
- Manages Node.js LTS and Python 3.12 versions
- Task runner for all common operations
- Environment variable loading from `.env` file
- Automatic Python virtual environment management
- All commands executed through mise tasks, never directly

### Code Quality

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting (TypeScript, JSON, Markdown, YAML, CSS)
- **Ruff** - Python formatting, linting, and import sorting
- Pre-commit hooks for automatic code quality checks

## Implementation Guide

### Phase 1: Convex Tutorial Foundation

**This phase sets up git, development environment, and the Convex tutorial project automatically.**

1. **Check prerequisites:**
   - Verify mise is installed (if not, provide installation instructions)
   - **Note**: Node.js will be installed via mise.toml, so it does not need to be pre-installed

2. **Initialize git and commit documentation:**
   - Initialize git repository with main as default branch: `git init --initial-branch=main`
   - Stage `PLATFORM_CONVEX.md`
   - Commit: `docs: add platform architecture specification`
   - This preserves the specification as the first commit

3. **Set up development environment:**
   - **CRITICAL - Create mise.toml with EXACT contents**: Create `mise.toml` with the following EXACT contents (do not modify or deviate):

   ```
   [tools]
   node = "lts"
   python = "3.12"

   [env]
   env_file = ".env"
   _.python.venv = { path = ".venv", create = true }


   [tasks.setup]
   description = "Set up development environment"
   run = """
   pip install -r requirements.txt
   npm install
   pre-commit install
   """

   [tasks.dev]
   description = "Start Next.js development server"
   run = "npm run dev"

   [tasks.convex]
   description = "Start Convex development mode"
   run = "npx convex dev"

   [tasks.build]
   description = "Build for production"
   run = "npm run build"

   [tasks.start]
   description = "Start production server"
   run = "npm start"

   [tasks.lint]
   description = "Run ESLint"
   run = "npm run lint"

   [tasks.format]
   description = "Format code with Prettier"
   run = "npx prettier --write ."

   [tasks.format-check]
   description = "Check code formatting"
   run = "npx prettier --check ."

   [tasks.pre-commit]
   description = "Run pre-commit hooks on all files"
   run = "npx prettier --write . && ruff format . && ruff check --fix . && ruff check --select I --fix ."
   ```

   - **CRITICAL - Create .gitignore with EXACT contents**: Create `.gitignore` with the following EXACT contents (do not modify or deviate):

   ```
   # Dependencies
   node_modules/
   .pnp
   .pnp.js

   # Testing
   coverage/

   # Next.js
   .next/
   out/
   build/
   dist/

   # Production
   *.log

   # Misc
   .DS_Store
   *.pem

   # Debug
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*

   # Local env files
   .env*.local
   .env

   # Vercel
   .vercel

   # TypeScript
   *.tsbuildinfo
   next-env.d.ts

   # Python
   .venv/
   __pycache__/
   *.py[cod]
   *$py.class
   *.so
   .Python

   # Convex
   .convex/

   # IDE
   .vscode/
   .idea/
   *.swp
   *.swo
   *~
   ```

   - **CRITICAL - Create requirements.txt with EXACT contents**: Create `requirements.txt` with the following EXACT contents (do not modify or deviate):

   ```
   ruff>=0.1.0
   pre-commit>=3.0.0
   ```

   - **CRITICAL - Create package.json with EXACT contents**: Create `package.json` with the following EXACT contents (do not modify or deviate). This minimal package.json includes prettier as a dependency for pre-commit hooks:

   ```
   {
     "name": "convex-platform",
     "version": "0.1.0",
     "private": true,
     "type": "module",
     "dependencies": {
       "prettier": "^3.8.1"
     }
   }
   ```

   - **CRITICAL - Create .pre-commit-config.yaml with EXACT contents**: Create `.pre-commit-config.yaml` with the following EXACT contents (do not modify or deviate). This configures pre-commit hooks for Prettier (TypeScript, JSON, Markdown, YAML, CSS) and Ruff (Python formatting, linting, import sorting):

   ```
   repos:
     - repo: local
       hooks:
         - id: prettier
           name: Prettier
           entry: npx prettier --write
           language: system
           types: [file]
           files: \.(ts|tsx|js|jsx|json|md|yaml|yml|css)$
         - id: ruff-format
           name: Ruff Format
           entry: ruff format
           language: system
           types: [file]
           files: \.py$
         - id: ruff-lint
           name: Ruff Lint
           entry: ruff check --fix
           language: system
           types: [file]
           files: \.py$
         - id: ruff-imports
           name: Ruff Import Sorting
           entry: ruff check --select I --fix
           language: system
           types: [file]
           files: \.py$
   ```

   - Create empty `.env` file using `touch .env` (will be populated with environment variables later)
   - Run `mise install` to install Node.js and Python versions via mise
   - **CRITICAL**: Immediately after `mise install` completes successfully, run `mise setup` to install npm dependencies, Python dependencies, and set up pre-commit hooks
   - **CRITICAL - Error Handling**: If mise reports ANY errors (parse errors, syntax errors, etc.), STOP and fix them immediately. Do NOT ignore errors or proceed to the next step. Common errors:
     - TOML parse errors: Check for unquoted table names with colons or hyphens
     - Version errors: Verify version strings are correct
     - Fix all errors before proceeding
   - **Test**: Verify mise tasks work (run a test task), Node.js and Python versions are installed correctly, `.env` is automatically loaded, and dependencies are installed
   - **CRITICAL - Do NOT skip this commit**: After `mise install` and `mise setup` complete successfully AND all tests pass, immediately stage all files (mise.toml, .env, .gitignore, requirements.txt, package.json, .pre-commit-config.yaml) and commit: `chore: set up development environment with mise`
   - **Do NOT proceed to step 4 until this commit is complete and verified**
   - **Note**: After `mise install`, Node.js and npm will be available through mise's environment, and `.env` variables will be loaded automatically

4. **Set up Convex tutorial project:**
   - Create a temporary child directory (e.g., `temp-convex-setup/`)
   - Run `mise exec -- npm create convex@latest temp-convex-setup -- --template nextjs --yes` in the child directory
   - The `--template nextjs` flag automatically selects Next.js client (required for Next.js 16 with App Router architecture) without prompting
   - The `--yes` flag accepts all other defaults to avoid interactive prompts
   - This uses mise to execute npm (Node.js will be provided by mise)
   - This creates a Next.js + Convex project with the tutorial foundation
   - The command will prompt for Convex login and project creation if needed (these cannot be skipped)
   - Copy all files from `temp-convex-setup/` to the project root (excluding the directory itself)
   - Delete the `temp-convex-setup/` directory
   - **Note**: `.gitignore` already includes `.convex/` from the exact contents specified in step 3, so no update needed

5. **Test the tutorial project:**
   - Verify the development server starts successfully
   - Check that basic queries and mutations work
   - Ensure Convex is properly connected and types are generated
   - Verify no errors in console or terminal
   - **Test**: Run development server, verify Convex connection, test basic functionality

6. **Commit tutorial project:**
   - Stage all tutorial project files
   - Commit: `chore: set up Convex tutorial foundation`
   - This preserves the tutorial project as a clean baseline

7. **Proceed to Phase 2:**
   - The tutorial project provides the essential Convex foundation (connection, basic setup, authentication if included)
   - All platform features described below will be built on top of this foundation
   - Only proceed to Phase 2 after the tutorial project is committed and working

### Phase 2: Platform Implementation

**Once the tutorial project is confirmed complete, implement the platform features in this order:**

1. **Development Infrastructure**
   - **Note**: mise is already set up in Phase 1, so this step focuses on verifying and organizing
   - Verify mise tasks work correctly
   - Verify pre-commit hooks are installed and working (already set up in Phase 1)
   - Set up file organization structure (components/, lib/, etc.)
   - **Test**: Verify mise tasks work, pre-commit hooks run, project structure is correct

2. **Design System & Theming**
   - Configure Tailwind CSS v4 with CSS-first approach
   - Set up theme system (`theme.css` with CSS variables)
   - Configure font optimization (`font.ts`)
   - **Ask user**: Which ShadCN components to install initially (at minimum: Button, Input, Card, Label for forms)
   - Install and configure ShadCN UI components
   - Create design system showcase page at `/design`
   - **Test**: Verify Tailwind works, theme variables apply correctly, fonts load, ShadCN components render, `/design` page displays theme colors and components

3. **Validation Architecture**
   - Create `lib/validation/` directory structure
   - Implement pure validation functions organized by domain
   - Integrate validation functions with forms and Convex mutations
   - **Test**: Verify validation functions work on client-side (immediate feedback), validation works in Convex mutations, error messages display correctly

4. **Protected Routes System**
   - Implement protected route group layout
   - Set up layered authentication architecture
   - Create protected route components and patterns
   - **Test**: Verify unauthenticated users redirect to login, authenticated users can access protected routes, auth state updates correctly

5. **Component Organization**
   - Organize components into UI and feature directories
   - Set up component patterns and conventions
   - Integrate ShadCN components with theme system
   - **Test**: Verify components render correctly, theme applies to components, component organization follows patterns

6. **Convex Function Organization**
   - Organize Convex functions by domain/feature
   - Set up schema organization
   - Implement query, mutation, and action patterns
   - **Test**: Verify queries return data correctly, mutations update database, actions execute, types generate properly

**Implementation Notes:**

- **CRITICAL: Test each phase before moving to the next**
- **CRITICAL: Never ignore errors - if any step produces errors, STOP and fix them immediately before proceeding**
- **CRITICAL: Do not skip commits - each phase must be committed after it works, before moving to the next phase**
- After completing each phase, verify all features work:
  - Run the development server
  - Test functionality manually in the browser
  - Verify no errors in console or terminal
  - Confirm features behave as expected
  - If errors occur, fix them before proceeding
- **After confirming a phase works (with no errors), commit changes to git:**
  - Check if git is initialized (initialize if needed)
  - Stage all changes for the completed phase
  - Commit using Conventional Commits standard
  - Use appropriate commit type (feat, chore, build, etc.)
  - Write clear, descriptive commit messages
  - Example: `feat: organize development infrastructure and file structure`
  - Example: `feat: implement design system with Tailwind v4 and theme variables`
  - **Ask user to confirm** the commit message before committing (or proceed if they prefer)
- **Before proceeding to next phase:**
  - Confirm with user that current phase is working correctly with NO errors
  - Ensure all changes are committed to git
  - Verify the commit was successful
  - Only proceed after user confirmation or explicit instruction
  - **Do NOT proceed if there are uncommitted changes or unresolved errors**
- The goal is to leave the user with a fully functional platform at each stage
- If something doesn't work, explain the issue to the user and fix it before committing
- The tutorial project provides the Convex foundation; all other features are additions
- Reference the detailed architecture patterns below for specific implementation details
- Maintain the file organization and conventions described throughout this document
- **Ask the user for preferences** when choices are needed (components, colors, etc.)

## Architecture Patterns

### Project Structure

#### Routing Layer (`app/`)

- Next.js App Router with route groups for organization
- Route groups (parentheses syntax) don't appear in URLs
- Public routes in `app/auth/` for authentication pages
- Protected routes in `app/(protected)/` route group
- Design system showcase at `app/design/` route
- API routes used only for webhooks or external integrations

#### Component Organization (`components/`)

- UI components in `components/ui/` - ShadCN components
- Feature components in `components/<feature>/` directories
- Clear separation between reusable UI and feature-specific components
- Client Components use Convex hooks for real-time data

#### Backend Organization (`convex/`)

- Schema definition in `convex/schema.ts` - Database structure
- Feature-based organization in `convex/<feature>/` directories:
  - `schema.ts` - Table definitions for the feature
  - `queries.ts` - Public query functions (read operations)
  - `mutations.ts` - Public mutation functions (write operations)
  - `internalQueries.ts` - Backend-only query functions
  - `internalMutations.ts` - Backend-only mutation functions
  - `internalActions.ts` - Long-running operations or external integrations
- Authentication in `convex/auth.ts` and `convex/auth.config.ts`
- Generated types in `convex/_generated/` (auto-generated, don't edit)

#### Utilities & Configuration (`lib/`)

- Convex client provider setup at root level
- Shared utilities in `lib/utils.ts`
- Pure validation functions in `lib/validation/` organized by domain
- Convex React hooks used directly in components

#### Type System (`convex/_generated/`)

- Auto-generated Convex TypeScript types
- Types regenerated automatically when schema changes
- Types available immediately in frontend via Convex client

### Convex Function Architecture

#### Query Functions

- Defined in `convex/<feature>/queries.ts`
- Public functions that can be called from frontend
- Return data that can be subscribed to reactively
- Automatically type-safe based on schema
- Can access authentication context

#### Mutation Functions

- Defined in `convex/<feature>/mutations.ts`
- Public functions for writing data
- Automatically type-safe based on schema
- Can access authentication context
- Return updated data or success indicators

#### Internal Functions

- `internalQueries.ts` and `internalMutations.ts` for backend-only operations
- Called by other Convex functions, not from frontend
- Useful for complex business logic or data transformations
- Can access service-level permissions

#### Action Functions

- Defined in `convex/<feature>/internalActions.ts` or `convex/<feature>/actions.ts`
- For long-running operations or external API calls
- Can make HTTP requests, call AI services, send emails
- Not reactive (don't return real-time data)
- Useful for side effects and integrations

### Authentication Architecture

#### Convex Auth Integration

- Uses `@convex-dev/auth` library
- Supports multiple providers (OAuth, email/password, etc.)
- Session management handled by Convex
- Authentication state available in all Convex functions via context

#### Client-Server Boundary

- Server Components can check auth via Convex queries
- Client Components use Convex hooks that automatically handle auth state
- Protected routes check authentication server-side
- Server-side redirects for unauthenticated users
- Auth state synchronized automatically via Convex client

#### Protected Routes Pattern

- Protected route group layout checks authentication via Convex query
- Redirects to login before any protected content renders
- Individual pages don't need auth checks (handled by layout)
- Convex queries automatically respect authentication context
- Layered architecture: Server auth check → Client layout provider → Client layout structure → Server content

#### Auth State Management

- Server Components use Convex queries to check auth
- Client Components use Convex hooks for reactive auth state
- Auth state available in all Convex functions automatically
- Session refresh handled automatically by Convex

### Data Flow Patterns

#### Real-time Data Subscriptions

- Frontend uses Convex React hooks (useQuery, useMutation)
- Queries automatically subscribe to data changes
- UI updates reactively when data changes in database
- Optimistic updates supported for mutations

#### Form-to-Database Flow

- Client Component form with React Hook Form
- Pure validation functions called during form input for immediate feedback
- Form submission calls Convex mutation via hook
- Convex mutation validates via Convex validators (type checking) and pure validation functions (business rules)
- Validation happens within the mutation transaction
- If validation fails: Mutation throws error with validation details
- Error is returned to client through mutation response
- Application code catches error and displays to user (toast, inline message, etc.)
- If validation passes: Mutation updates database
- Real-time WebSocket updates provide immediate feedback on success
- Query subscriptions automatically update UI

#### Server-to-Client Data Passing

- Only serializable data can be passed (strings, numbers, objects, arrays)
- Functions and React components cannot be passed
- Pattern for component references: use string identifiers, map in Client Component
- Server Components can call Convex queries directly
- Data flows: Convex database → Convex query → React hook → Component

### Convex Schema Architecture

#### Schema Definition

- Defined in `convex/schema.ts` using Convex schema builder
- Type-safe table definitions
- Field types and constraints defined in schema
- Indexes defined in schema
- Schema changes automatically trigger type regeneration

#### Validation Layers

- Schema-level validation via Convex (database structure)
- Convex validator functions for function argument validation
- Type safety ensures consistency across all layers

### Theming System Architecture

#### Theme File (`app/theme.css`)

- Contains `:root` section for light mode CSS variables
- Contains `.dark` section for dark mode CSS variables
- Defines all color tokens: primary, secondary, muted, accent, destructive, etc.
- Defines sidebar-specific color tokens
- Defines spacing, radius, and shadow tokens
- Can be completely replaced with output from theme tools
- Theme tools must output both `:root` and `.dark` sections

#### Global Styles (`app/globals.css`)

- Imports Tailwind CSS v4
- Imports `theme.css` to load color variables
- Uses `@theme inline` directive to map CSS variables to Tailwind utilities
- Defines font CSS variables (separate from theme for swappability)
- Base layer styles for body and global elements
- Dark mode variant configuration

#### Font Configuration (`app/font.ts`)

- Uses Next.js font optimization API
- Exports font instances (e.g., Inter, JetBrains Mono)
- Next.js automatically injects CSS variables
- Font variables defined in `globals.css` (not `theme.css`) to keep theme swappable
- Supports Google Fonts, local fonts, or system fonts

#### Tailwind Configuration

- Minimal `tailwind.config.ts` - only content paths
- Theme defined in CSS via `@theme` directive, not JavaScript
- Dark mode strategy configured in CSS
- No PostCSS configuration needed (Tailwind v4 CSS-first approach)

#### Design System Showcase

- Route at `/design` displays all theme colors and components
- Dynamically reads CSS variables from current theme
- Automatically reflects changes when `theme.css` is updated
- Includes dark mode toggle for preview
- Shows both light and dark mode values
- Can store user theme preference in Convex database

### Component System

#### ShadCN UI Integration

- Components installed via CLI to `components/ui/`
- Copy-paste architecture (not npm dependencies)
- Components can be customized directly in project
- Built on Radix UI primitives
- Styled with Tailwind using theme CSS variables

#### Component Categories

- Form & Input components (Button, Input, Select, Checkbox, etc.)
- Layout & Navigation (Navigation Menu, Sidebar, Tabs, Separator, etc.)
- Overlays & Dialogs (Dialog, Sheet, Popover, Tooltip, etc.)
- Feedback & Status (Alert, Toast, Progress, Badge, etc.)
- Display & Media (Card, Table, Avatar, Chart, etc.)

#### Component Usage Pattern

- Always check ShadCN component catalog before building custom components
- Install via CLI when needed
- Customize in place if needed
- Only build custom components if no ShadCN option exists

## Development Workflow

### Testing Strategy

**Testing is integral to the implementation process. Each feature must be tested before moving forward.**

#### Testing Each Phase

- After implementing each phase, immediately test all functionality
- Run the development server and verify features work in the browser
- Check for console errors, terminal errors, and runtime issues
- Test user flows manually to ensure everything behaves correctly
- Fix any issues before proceeding to the next phase

#### What to Test

- **Development Infrastructure**: Verify mise tasks execute, pre-commit hooks run, file structure is correct
- **Design System**: Verify Tailwind classes work, theme variables apply, fonts load, components render, `/design` page displays correctly
- **Validation**: Verify client-side validation provides immediate feedback, server-side validation works, error messages display
- **Protected Routes**: Verify authentication redirects work, protected routes are accessible when authenticated
- **Components**: Verify components render, theme applies, interactions work
- **Convex Functions**: Verify queries return data, mutations update database, real-time updates work

#### Testing Approach

- Start the development server after each phase
- Navigate through the application manually
- Test both success and error cases
- Verify real-time features update correctly
- Check that validation provides appropriate feedback
- Ensure no console or terminal errors

#### Git Commit Workflow

- After confirming each phase works correctly, commit changes to git
- Use Conventional Commits standard for commit messages
- Commit types to use:
  - `feat:` for new features (e.g., `feat: add design system with Tailwind v4`)
  - `chore:` for development infrastructure (e.g., `chore: set up development environment with mise`)
  - `build:` for build system changes (e.g., `build: configure Tailwind CSS v4`)
  - `refactor:` for code organization (e.g., `refactor: organize Convex functions by domain`)
- Write clear, descriptive commit messages explaining what was added
- Stage all changes for the completed phase before committing
- Do not proceed to the next phase until changes are committed

#### Goal

- Leave the user with a fully working platform at each stage
- Each phase should be production-ready before moving to the next
- The user should be able to use the platform features as they are built
- No broken functionality should be left behind
- All changes should be committed to git with clear commit messages

### Environment Setup

- Single prerequisite: mise (development environment manager)
- Setup is done manually following Phase 1 steps (not via a script)
- Phase 1 sets up: git, mise.toml, .gitignore, requirements.txt, .env
- Installs Node.js LTS and Python 3.12 via mise
- Creates Python virtual environment automatically via mise setup task
- Installs npm dependencies from `package.json` via mise setup task
- Installs Python dependencies from `requirements.txt` via mise setup task
- Sets up pre-commit hooks via mise setup task
- Convex project is initialized in Phase 1, Step 4
- Convex authentication and ShadCN UI are configured in Phase 2

### Command Execution

- All commands executed through mise tasks
- Never prefix mise tasks with `mise exec --`
- One-off commands (like npm, component CLI) use `mise exec --` to ensure Node.js from mise is used
- Tasks defined in `mise.toml` file
- **Important**: Since Node.js is installed via mise, npm commands should use `mise exec -- npm ...` when not using mise tasks

### Common Tasks

#### Development

- Start development server (Next.js)
- Start Convex development (runs backend and watches for changes)
- Build for production
- Start production server
- Run linter

#### Convex Operations

- Start Convex development mode (watches for changes, auto-deploys)
- Deploy Convex functions to production
- View Convex dashboard
- Types generated automatically when schema changes

#### Code Quality

- Run pre-commit hooks on all files
- Reinstall pre-commit hooks

### Dependency Management

#### Node.js Packages

- All dependencies in `package.json`
- Installed via `npm install` (run by mise setup task)
- Never install packages by name in `mise.toml` tasks
- ShadCN components installed via CLI (not npm)
- Convex packages: `convex`, `@convex-dev/auth`

#### Python Packages

- Dependencies in `requirements.txt`
- Installed into `.venv` virtual environment
- Managed automatically by mise
- Used only for local tooling (pre-commit, scripts)

#### ShadCN Components

- Installed via CLI command
- Components copied to `components/ui/`
- No npm dependencies added
- Can be customized directly in project

### Schema Workflow

#### Schema Changes

1. Edit schema in `convex/schema.ts` or feature-specific schema files
2. Convex automatically detects changes in development mode
3. Types regenerated automatically
4. Frontend types update automatically via Convex client

#### Type Generation

- Types generated automatically by Convex
- Available immediately in frontend
- Types in `convex/_generated/` directory

### Code Quality Workflow

#### Pre-commit Hooks

- Automatically installed during setup
- Run before each commit
- Format TypeScript, JSON, Markdown, YAML, CSS with Prettier
- Format, lint, and sort Python imports with Ruff
- Can be run manually on all files

#### Linting

- ESLint configured for Next.js
- Run via mise task
- Not included in pre-commit hooks (run separately)

## Build & Deployment

### Build Process

- Next.js production build via mise task
- TypeScript compilation with strict mode
- Tailwind CSS compilation via PostCSS
- Static asset optimization
- Server Components compiled
- Convex functions deployed separately via Convex CLI

### Environment Configuration

- Environment variables loaded from `.env` file via mise
- Convex deployment URL and keys from Convex dashboard
- Environment variables set in Convex dashboard for backend
- Frontend environment variables for Convex client connection

### Deployment Architecture

- Frontend deploys to hosting platform (Vercel, etc.)
- Convex backend deploys independently via Convex CLI or dashboard
- Convex is serverless (no runtime management)
- Environment variables configured separately for frontend and backend

## Configuration Files

### mise.toml

- **MUST be valid TOML syntax** - Invalid TOML will cause mise to fail
- Defines Node.js and Python versions
- Configures tasks for all common operations
- Automatically loads environment variables from `.env` file using `env_file = ".env"`
- Manages Python virtual environment
- Setup task runs dependency installation
- Table names with colons (:) or hyphens (-) must be quoted (e.g., `["tasks:dev"]` not `[tasks:dev]`)

### components.json

- ShadCN UI configuration
- Component paths and import aliases
- Styling preferences
- Note: Theme colors managed in `theme.css`, not here

### tsconfig.json

- TypeScript strict mode enabled
- Path alias `@/*` maps to project root
- Required for component library imports
- Next.js plugin configuration

### tailwind.config.ts

- Minimal configuration
- Only content paths specified
- Theme defined in CSS, not JavaScript config
- Dark mode strategy in CSS

### next.config.ts

- Next.js configuration
- Convex client configuration if needed
- Can be extended for custom needs

### convex.json (Convex configuration)

- Convex project configuration
- Generated by Convex CLI
- Contains project ID and deployment settings

## Key Conventions & Rules

### Convex Functions

- Queries for read operations, mutations for write operations
- Actions for side effects and external integrations
- Internal functions for backend-only operations
- All functions are automatically type-safe based on schema
- Use Convex validators for function argument validation

### Component Development

- Always check ShadCN component catalog first
- Install ShadCN components before building custom
- Fix ShadCN component issues, don't work around them
- Custom components only when no ShadCN option exists

### Command Execution

- Always use mise tasks for common operations
- Use `mise exec --` for one-off commands
- Never prefix mise tasks with `mise exec --`
- Convex commands run via Convex CLI

### File Organization

- Convex functions in `convex/<feature>/` organized by domain
- Schema in `convex/schema.ts` or feature-specific schema files
- Pure validation functions in `lib/validation/<domain>.ts` organized by domain
- Components in `components/` (UI in `components/ui/`)
- Convex provider setup at app root level

### Type Safety

- TypeScript strict mode enabled
- Convex schema provides database types automatically
- Convex validators provide runtime validation with type safety
- Type inference ensures consistency
- Generated Convex types for all database operations

### Theming

- Edit `app/theme.css` to change theme
- Theme tools must output `:root` and `.dark` sections
- Font configuration separate in `app/font.ts`
- Font variables in `globals.css` to keep theme swappable
- Can store user theme preference in Convex database

### Validation Strategy

- Validation logic defined as pure TypeScript functions
- Pure functions work on both client and server (no dependencies on Convex runtime)
- Functions return error messages (string) or null if valid
- Single source of truth: Validation rules defined once, used everywhere

#### Client-Side Validation

- Pure validation functions called during form input
- Provides immediate feedback as user types
- Functions validate input and return error messages
- Application displays errors in real-time

#### Server-Side Validation

- Same pure validation functions called in Convex mutations
- Convex validators validate function arguments (type checking)
- Pure validation functions validate business rules and constraints
- Validation happens within the mutation transaction (performant, no extra round-trip)
- When validation fails: Mutation throws error with validation details
- Error is returned to client through mutation response
- Application must catch and display error to user (error message, toast notification, etc.)

#### Validation Flow

- Client-side: Pure functions validate during typing for immediate feedback
- Server-side: Convex validators check types, pure functions check business rules
- Both use the same validation logic, ensuring consistency

## Security Architecture

### Authentication

- Convex handles authentication via `@convex-dev/auth`
- Session management built into Convex
- Authentication context available in all functions
- Protected routes check auth server-side

### Input Validation

- Convex schema provides automatic database-level validation
- Convex validators validate function arguments and data
- Type safety prevents invalid data structures

### Data Access

- Convex functions automatically respect authentication context
- Queries and mutations can check user identity
- Internal functions for backend-only operations
- Database access only through Convex functions

### Function Security

- Public functions (queries, mutations) can be called from frontend
- Internal functions only callable from other Convex functions
- Actions can make external calls but are not reactive
- Authentication context available in all function types

## Platform Capabilities

### Authentication

- Multiple provider support via `@convex-dev/auth`
- OAuth and email/password authentication
- Session management handled by Convex
- Protected route system
- User state synchronization

### Database

- Real-time database via Convex
- Schema defined in code
- Automatic type generation
- Real-time subscriptions built-in
- No migrations needed (schema is code)

### Styling

- Tailwind CSS v4 with CSS-first approach
- Theme system with CSS variables
- Dark mode support
- Font optimization via Next.js
- Component library (ShadCN UI)

### Development Experience

- Type-safe end-to-end
- Hot reload for both frontend and backend
- Automatic code formatting
- Pre-commit quality checks
- Real-time data updates
- Automatic type generation
- Design system showcase page

### Real-time Features

- Built-in real-time subscriptions
- UI updates automatically when data changes
- Optimistic updates supported

## Extension Points

### Testing New Features

**When adding new features, always test them before considering the work complete.**

- Test the feature manually in the browser
- Verify all user flows work correctly
- Test both success and error cases
- Check for console or terminal errors
- Verify real-time updates work if applicable
- Ensure validation provides appropriate feedback
- Confirm the feature integrates correctly with existing platform infrastructure

### Adding Features

1. Define schema in `convex/schema.ts` or feature-specific schema
2. Create Convex queries in `convex/<feature>/queries.ts`
3. Create Convex mutations in `convex/<feature>/mutations.ts` with validators
4. Create form component using Convex mutation hook
5. Create page in `app/<route>/page.tsx` or `app/(protected)/<route>/page.tsx`
6. Use Convex hooks in components for real-time data

### Adding Protected Routes

1. Create route in `app/(protected)/<route>/page.tsx`
2. Create content component in `components/<feature>/`
3. Layout automatically handles auth via Convex query
4. No individual page auth checks needed
5. Convex functions automatically respect auth context

### Customizing Theme

1. Edit `app/theme.css` directly, or
2. Use theme tool to generate theme
3. Replace contents of `app/theme.css` with tool output
4. Visit `/design` to preview changes
5. Optionally store user preference in Convex database

### Adding ShadCN Components

1. Check component catalog for availability
2. Install via CLI command
3. Component copied to `components/ui/`
4. Customize as needed in place

### Adding Convex Functions

1. Define schema changes if needed
2. Create query/mutation/action in appropriate file
3. Function automatically available via Convex client
4. Types generated automatically
5. Use in frontend via Convex hooks

## Troubleshooting & Error Handling

### When Things Go Wrong

**If you encounter issues during implementation:**

1. **Stop and assess:**
   - Read error messages carefully (console, terminal, browser)
   - Check if the issue is with the current phase or a previous one
   - Verify all prerequisites are met

2. **Communicate with the user:**
   - Explain what error occurred
   - Show the user the error message
   - Ask if they want to fix it now or skip to the next phase
   - Provide context about what might have gone wrong

3. **Fix or proceed:**
   - If fixable, implement the fix and test again
   - If the user wants to proceed, note the issue for later
   - Document any workarounds or known issues

### Common Issues

- **mise not found**: Ask user to install mise first
- **Git not initialized**: Initialize git repository
- **Convex connection errors**: Verify Convex project is set up correctly
- **Type errors**: Check that Convex types are generated
- **Build errors**: Verify all dependencies are installed
- **Component errors**: Check ShadCN components are installed correctly

### Getting Help

- Reference the architecture patterns in this document
- Check Convex documentation for Convex-specific issues
- Check Next.js documentation for Next.js-specific issues
- Ask the user for clarification if instructions are unclear

## Deployment Considerations

### Environment Variables

- Convex deployment URL and keys required
- Set in Convex dashboard for backend
- Set in frontend deployment platform for client connection
- Convex handles local development configuration

### Build Requirements

- Node.js LTS version (managed by mise in development)
- All npm dependencies from `package.json`
- TypeScript compilation
- Next.js static and server-side compilation
- Convex functions deployed separately

### Runtime Requirements

- Node.js runtime for Next.js server
- Convex backend (serverless)
- Environment variables configured

### Schema Deployment

- Schema changes deployed automatically with Convex functions
- Schema is code, versioned with application code
- Types generated automatically on deployment
