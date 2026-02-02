# Conventional Commit Command

Commit staged git changes following the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## CRITICAL: Only Staged Changes

**ONLY analyze and describe STAGED changes.**

- Use `git diff --cached` to see staged changes - this is the ONLY diff you should look at
- NEVER use `git diff` (without --cached) - that shows unstaged changes which are NOT being committed
- The commit message must ONLY describe what is in the staged diff, nothing else

## Workflow

1. **Check staged files**: Run `git diff --cached --name-status` to get the list of staged files.

2. **If no staged files**: Inform the user they need to stage files first with `git add` and stop.

3. **Run pre-commit hooks**: Run `pre-commit run` to format and lint staged files.

4. **Re-stage files if needed**: After pre-commit, check `git status --short`. If any previously staged files now show as modified (have `M` in the second column), re-stage them with `git add`.

5. **Analyze ONLY staged changes**: Run `git diff --cached` to see exactly what will be committed. Read this diff carefully - the commit message must describe ONLY these changes. Analyze:
   - Which files were modified, added, or deleted
   - What specific changes were made in each file
   - The purpose and impact of the changes
   - Any patterns or themes across multiple files
   - Key implementation details worth noting

6. **Generate commit message**: Create a conventional commit message with a detailed body:

   Format:

   ```
   type(scope): description

   Detailed summary of changes:
   - List key changes made
   - Include file-by-file summary if multiple files changed
   - Explain what was added, modified, or removed
   - Note any breaking changes or important details
   ```

   Types:
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation only changes
   - `style`: Code style changes (formatting)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks
   - `perf`: Performance improvements
   - `ci`: CI/CD changes
   - `build`: Build system changes

   Guidelines:
   - Keep subject line to 50 characters or less
   - Use imperative mood ("Add" not "Added")
   - Don't end subject with a period
   - Scope is optional but helpful
   - Body should provide a comprehensive summary of what changed
   - Include specific details about files modified and key changes
   - Use bullet points for clarity
   - Explain the "why" if it's not obvious from the diff

7. **Commit**: Run `git commit -m "<subject>" -m "<body>"` (or use a multi-line message with proper formatting)

## Example

```bash
# 1. Check what's staged
git diff --cached --name-status

# 2. Run pre-commit
pre-commit run

# 3. Re-stage if needed
git add <modified-files>

# 4. View staged diff (ONLY this informs the commit message)
git diff --cached

# 5. Commit with detailed message based ONLY on staged diff
git commit -m "chore(mise): simplify pre-commit task configuration" \
  -m "Detailed summary of changes:
- Updated mise.toml to consolidate pre-commit task definitions
- Removed redundant task configuration entries
- Simplified task structure for better maintainability
- No functional changes to pre-commit hooks themselves"
```

Or using a multi-line format:

```bash
git commit -m "chore(mise): simplify pre-commit task configuration

Detailed summary of changes:
- Updated mise.toml to consolidate pre-commit task definitions
- Removed redundant task configuration entries
- Simplified task structure for better maintainability
- No functional changes to pre-commit hooks themselves"
```
