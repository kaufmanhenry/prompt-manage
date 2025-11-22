# Code Quality & Linting Guide

This guide covers the linting, formatting, and code quality standards for Prompt Manage.

## Overview

We use a comprehensive code quality stack to maintain consistency and catch errors early:

- **ESLint** - JavaScript/TypeScript linting with type-aware rules
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Husky** - Git hooks for automated checks
- **lint-staged** - Run linters on staged files only
- **GitHub Actions** - CI/CD quality checks on PRs

## Quick Start

### Running Checks Locally

```bash
# Run all checks at once
npm run check-all

# Individual checks
npm run lint              # ESLint
npm run lint:fix          # ESLint with auto-fix
npm run format:check      # Prettier check
npm run format            # Prettier auto-format
npm run type-check        # TypeScript type checking
```

### Automated Checks

Code quality checks run automatically:

1. **Pre-commit** - Lints and formats staged files before commit
2. **Pre-push** - Runs TypeScript type-checking before push
3. **CI/CD** - All checks run on pull requests

## Configuration Files

### ESLint (`eslint.config.mjs`)

We use **ESLint Flat Config** with:

- TypeScript type-aware linting
- React Hooks safety checks
- Unused import removal
- Import sorting (alphabetical)
- Accessibility (a11y) warnings
- Tailwind CSS class ordering
- Prettier integration (no conflicts)

### Prettier (`.prettierrc`)

Formatting rules:

- No semicolons
- Single quotes
- Trailing commas
- 100 character line width
- 2 space indentation

### TypeScript (`tsconfig.json`)

Strict mode enabled with comprehensive type checking.

## Git Hooks

### Pre-commit Hook

Runs `lint-staged` which:

- Auto-fixes ESLint errors on staged `.js`, `.jsx`, `.ts`, `.tsx` files
- Auto-formats staged files with Prettier
- Only processes files you're committing (fast!)

**Location**: `.husky/pre-commit`

### Pre-push Hook

Runs full TypeScript type-checking before pushing to remote.

**Location**: `.husky/pre-push`

### Bypassing Hooks (Emergency Only)

```bash
# Skip pre-commit (not recommended)
git commit --no-verify

# Skip pre-push (not recommended)
git push --no-verify
```

> ⚠️ **Warning**: Bypassing hooks may cause CI failures. Only use in emergencies.

## VSCode Integration

### Recommended Extensions

Install these extensions for the best experience:

- **Prettier** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **Playwright Test** (`ms-playwright.playwright`)
- **MDX** (`unifiedjs.vscode-mdx`)

VSCode will prompt you to install these when you open the project.

### Auto-format on Save

The workspace settings (`.vscode/settings.json`) enable:

- Format on save with Prettier
- ESLint auto-fix on save
- Trailing whitespace removal
- Final newline insertion

## Common Issues & Fixes

### Issue: ESLint errors on commit

**Solution**: Run `npm run lint:fix` to auto-fix most issues.

### Issue: Prettier formatting conflicts

**Solution**: Run `npm run format` to format all files.

### Issue: TypeScript errors blocking push

**Solution**: Run `npm run type-check` to see all type errors, then fix them.

### Issue: Import order errors

**Solution**: ESLint will auto-sort imports. Run `npm run lint:fix`.

### Issue: Unused imports

**Solution**: ESLint will auto-remove unused imports. Run `npm run lint:fix`.

### Issue: Husky hooks not running

**Solution**:

```bash
# Reinstall Husky
npm run prepare
chmod +x .husky/pre-commit .husky/pre-push
```

## CI/CD Integration

### GitHub Actions Workflow

**File**: `.github/workflows/lint.yml`

Runs on every PR and push to `main`/`develop`:

1. ESLint check
2. Prettier format check
3. TypeScript type check

PRs cannot be merged if any check fails.

### Viewing CI Results

1. Go to your PR on GitHub
2. Scroll to "Checks" section
3. Click "Details" to see specific failures
4. Fix locally and push again

## Best Practices

### Before Committing

```bash
# Check everything
npm run check-all

# If errors, auto-fix what you can
npm run lint:fix
npm run format
```

### Writing New Code

1. Use TypeScript types (avoid `any`)
2. Remove unused imports
3. Follow existing code style
4. Let Prettier handle formatting
5. Fix ESLint warnings as you go

### Code Review

Reviewers should:

- Verify CI checks pass
- Look for logic errors (linters can't catch everything)
- Ensure code is readable and maintainable
- Check for proper TypeScript types

## Disabling Rules (Rare Cases)

Sometimes you need to disable a rule:

```typescript
// Disable for one line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = await fetchData()

// Disable for entire file (avoid!)
/* eslint-disable @typescript-eslint/no-explicit-any */
```

> ⚠️ **Warning**: Only disable rules when absolutely necessary and document why.

## Maintenance

### Updating Dependencies

```bash
# Update ESLint and plugins
npm update eslint typescript-eslint eslint-plugin-*

# Update Prettier
npm update prettier

# Test after updates
npm run check-all
```

### Adding New Rules

1. Edit `eslint.config.mjs`
2. Test on codebase: `npm run lint`
3. Fix any new errors: `npm run lint:fix`
4. Document in this guide if significant

## Summary

✅ **Automated**: Pre-commit hooks catch issues before commit  
✅ **Fast**: Only checks changed files locally  
✅ **Comprehensive**: ESLint + Prettier + TypeScript  
✅ **Enforced**: CI blocks PRs with quality issues  
✅ **Consistent**: Same rules for everyone via config files

**Questions?** Check existing code for examples or ask in team chat.
