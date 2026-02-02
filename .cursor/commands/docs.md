# Documentation Update Command

Update markdown documentation files based on git changes between main and HEAD, maintaining proper scope and structure for each document.

## CRITICAL: Branch Check

**ONLY run this command when NOT on the main branch.**

- Use `git branch --show-current` or `git rev-parse --abbrev-ref HEAD` to get current branch
- If branch is `main` or `master`, inform the user that this command only runs on feature branches and exit
- This command analyzes committed changes between main and the current branch

## Workflow

1. **Check current branch**: Run `git branch --show-current` to get the current branch name. If the branch is `main` or `master`, inform the user and exit immediately.

2. **Find all markdown files**: Run this exact command to find all markdown files, excluding any in directories starting with `.` and `node_modules`:

   ```bash
   find . -type f -name "*.md" ! -path "*/\.*" ! -path "*/node_modules/*"
   ```

   This command will:
   - Find all files (`-type f`) with `.md` extension (`-name "*.md"`)
   - Exclude any files in directories starting with `.` (`! -path "*/\.*"`)
   - Exclude any files in `node_modules` directories (`! -path "*/node_modules/*"`)
   - Start from the current directory (`.`)

   Read all found markdown files to understand their current structure, scope, and purpose.

3. **Check for git diffs**: Run `git diff main..HEAD --name-status` to see if there are any committed changes between main and HEAD. If there are no changes, inform the user and exit.

4. **Analyze git diffs**: Run `git diff main..HEAD` to get all committed changes between main and current branch. Parse the diff to understand:
   - New files added (status `A`)
   - Files modified (status `M`)
   - Files deleted (status `D`)
   - Code changes: new functions, schema changes, config changes, new dependencies, architecture changes

5. **Read existing documentation**: For each markdown file found, read and analyze:
   - Scope and purpose section (should be at the top of each doc)
   - High-level summary section (should be below scope/purpose)
   - Current content structure
   - Cross-references to other docs

6. **Map changes to documentation**: For each change in the diff:
   - Determine which doc(s) should be updated based on their scope and purpose
   - Identify if changes fit existing docs or require a new doc
   - Check for contradictions or inaccuracies with existing docs
   - Consider file path patterns (e.g., `convex/*` changes → `convex/README.md`)

7. **Update existing documentation**: For each doc that needs updates:
   - **Ensure structure**: Verify and add if missing:
     - Scope and purpose section at the top (for LLM context)
     - High-level summary section below scope/purpose
   - **Update content**: Add or update content relevant to the changes
   - **Add cross-references**: Instead of duplicating information, add markdown links to other relevant docs
   - **Remove negative language**: Never document "we don't do this" - only document what exists/is done
   - **Fix contradictions**: Resolve any contradictions or inaccuracies found

8. **Create new docs if needed**: If changes don't fit into any existing doc's scope without expanding it:
   - Create a new markdown file with a clear, descriptive name
   - Add scope and purpose section at the top
   - Add high-level summary section below scope
   - Add relevant content based on the changes
   - Ensure the new doc has a specific, focused scope

9. **Update README.md Documentation Index**: Always update the `README.md` file to maintain a "Documentation" section that:
   - Lists all markdown documentation files found using `find . -type f -name "*.md" ! -path "*/\.*" ! -path "*/node_modules/*"`
   - For each doc, includes:
     - The file path/name
     - A markdown link to the file
     - The scope and purpose (replicated from the top of each doc)
   - This section should be automatically updated whenever docs are added, removed, or their scope/purpose changes
   - Place this section after the main content but before "Join the community" or similar sections

## Documentation Principles

Follow these principles when updating documentation:

- **Scope Maintenance**: Each doc has a specific scope defined at the top. Updates must fit that scope. Don't expand a doc's scope unnecessarily - create a new doc instead.

- **No Duplication**: Instead of repeating information across multiple docs, have them reference each other using markdown links. For example: "See [PLATFORM.md](PLATFORM.md) for details on the technology stack."

- **Positive Documentation**: Only document what exists/is done. Never document "we don't do this" as a means to explain decisions. Just document what is.

- **Structure Requirements**: Every doc must have:
  1. **Scope and purpose section** at the top (for LLM context and human readers)
  2. **High-level summary section** below scope (for readers who don't want to scan all details)
  3. Detailed content below

- **Accuracy**: Check for and fix contradictions or inaccuracies. Ensure all information is consistent across docs.

- **Documentation Index**: `README.md` must contain a "Documentation" section listing all docs with their scope and purpose for easy discovery.

## Example Scenarios

- **New Convex function added**: Update `convex/README.md` if it fits the scope, or create a function-specific doc if it doesn't
- **New dependency added**: Update `PLATFORM.md` in the appropriate technology section
- **New component added**: Update relevant frontend docs or create new if needed
- **Schema changes**: Update `convex/README.md` or schema-specific documentation
- **Config changes**: Update relevant platform/development docs
- **New documentation file created**: Add it to the Documentation section in `README.md`

## Technical Details

- Use `git diff main..HEAD --name-status` to get file change list with status codes
- Use `git diff main..HEAD` to get full diff content for analysis
- Parse diffs to identify:
  - New exports/functions (look for `export const`, `export function`)
  - Schema changes (look for `defineSchema`, table definitions)
  - Config changes (package.json, tsconfig.json, etc.)
  - New dependencies (package.json changes)
  - Architecture changes (new directories, major refactors)
- Use file path patterns to determine which doc to update:
  - `convex/*` → `convex/README.md`
  - `app/*`, `components/*` → Frontend docs or create new
  - Root config files → `PLATFORM.md` or relevant doc

## Error Handling

- **If on main branch**: Inform user that this command only runs on feature branches, exit gracefully
- **If no diffs found**: Inform user there are no changes between main and HEAD, exit gracefully
- **If markdown files can't be read**: Report error for that specific file, continue with others
- **If git commands fail**: Report error and exit (don't proceed with incomplete information)

## Example

```bash
# 1. Check current branch
git branch --show-current

# 2. Find all markdown files
find . -type f -name "*.md" ! -path "*/\.*" ! -path "*/node_modules/*"

# 3. Check for changes
git diff main..HEAD --name-status

# 4. Analyze changes
git diff main..HEAD

# 5. Update documentation based on changes
# (AI will read files, analyze diffs, and make appropriate updates)

# 6. Update README.md documentation index
# (AI will ensure Documentation section is up to date)
```

## Notes

- This command makes edits only - it does NOT automatically commit changes
- The command should be thorough in analyzing changes and ensuring documentation is accurate and complete
- When in doubt about which doc to update, prefer creating a new focused doc over expanding an existing doc's scope
- Always maintain the documentation index in README.md, even if no other changes are needed
