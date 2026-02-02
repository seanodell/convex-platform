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

5. **Analyze ONLY staged changes**: Run `git diff --cached` to see exactly what will be committed. Read this diff carefully - the commit message must describe ONLY these changes.

6. **Generate commit message**: Create a conventional commit message:

   ```
   type(scope): description
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

7. **Commit**: Run `git commit -m "<message>"`

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

# 5. Commit with message based ONLY on staged diff
git commit -m "chore(mise): simplify pre-commit task configuration"
```
