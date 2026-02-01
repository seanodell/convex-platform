---
name: commit
description: Commit staged changes using conventional commit format. Use when the user asks to commit changes, create a commit, or commit code. This skill handles pre-commit hooks, re-staging files, and generates conventional commit messages using Cursor's understanding of the codebase.
---

# Conventional Commit Skill

This skill commits staged git changes following the [Conventional Commits](https://www.conventionalcommits.org/) specification. It uses Cursor's codebase understanding (via codebase_search and file reading) to analyze changes. It handles the complete workflow: running pre-commit hooks, re-staging files if needed, understanding changes semantically, and creating a properly formatted commit.

## When to Use

- Use this skill when the user asks to:
  - "Commit my changes"
  - "Create a commit"
  - "Commit these changes"
  - "Commit using conventional commits"
  - Any variation of committing staged changes

## Important Safety Note

**This skill ONLY works with staged changes.** It will never commit unstaged files. The user must stage files first with `git add` before using this skill.

## Workflow

1. **Check staged files**: Use `git status --short` or `git diff --cached --name-status` to get the list of staged files and their status (A=added, M=modified, D=deleted).

2. **Run pre-commit hooks**: Run `pre-commit run` to format and lint staged files. If pre-commit modifies files, they need to be re-staged.

3. **Re-stage files if needed**: After pre-commit, check if any files were modified. If so, re-stage them:
   - For added/modified files: `git add <file>`
   - For deleted files: `git rm --cached <file>` (if the file exists in the index)

4. **Understand the changes**: Use Cursor's tools to understand what changed:
   - Use `codebase_search` to understand the semantic meaning of changes
   - Use `read_file` to read specific files if needed (especially for new files)
   - Use `git diff --cached --stat` to get a summary of changes

5. **Generate commit message**: Create a conventional commit message following the format:

   ```
   type(scope): description

   Optional body explaining what and why
   ```

   Conventional commit types:
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation only changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks
   - `perf`: Performance improvements
   - `ci`: CI/CD changes
   - `build`: Build system changes

   Guidelines:
   - Keep the subject line to 50 characters or less
   - Use imperative mood ("Add" not "Added")
   - Capitalize the subject line
   - Don't end the subject with a period
   - Use the body to explain what and why, not how

6. **Commit changes**: Run `git commit -m "<generated_message>"` with the AI-generated commit message.

## Error Handling

- If no staged files are found, inform the user they need to stage files first with `git add`
- If pre-commit fails, show the error output to the user
- If commit fails, show the error message

## Example Usage

When the user asks to commit changes:

1. Check what's staged: `git status --short` or `git diff --cached --name-status`
2. Run pre-commit: `pre-commit run`
3. Re-stage any files modified by pre-commit (if needed)
4. Understand the changes using Cursor's tools:
   - Use `codebase_search` to understand the semantic meaning
   - Read key files if needed (especially new files)
   - Use `git diff --cached --stat` for a summary
5. Generate an appropriate conventional commit message based on your understanding
6. Commit: `git commit -m "feat(auth): add user authentication"`
