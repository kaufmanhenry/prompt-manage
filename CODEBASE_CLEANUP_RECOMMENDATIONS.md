# Codebase Cleanup Recommendations

This document outlines files and code that can be safely removed to reduce bloat and improve maintainability.

## Priority: High - Remove Immediately

### 1. Test/Debug Files in Root

These should be in a `scripts/` or `tests/` directory or removed:

- **`test-results.txt`** - Delete (test output file)
- **`test-pricing.ts`** - Move to `/scripts/test-pricing.ts` or delete
- **`verify_directory.ts`** - Move to `/scripts/verify-directory.ts` or delete
- **`find_duplicates.ts`** - Move to `/scripts/find-duplicates.ts` or delete

### 2. Deprecated Webhook Files

- **`app/api/webhooks/stripe/route.ts`** - Already deprecated, can be deleted
- **`app/api/webhooks/stripe/DEPRECATED_OLD_WEBHOOK.md`** - Can be moved to docs/archive after webhook is confirmed working

### 3. Console.log Statements in Production Code

Files with console.log that should use proper logging:

- `app/[locale]/pricing/page.tsx:93,94,95,96,97` - Has debug logging in checkout flow
- `app/api/stripe/create-checkout-session/route.ts` - Uses console.log (acceptable for server-side, but should use logger)
- `components/GoogleSignInButton.tsx:31` - Dev-only log, okay
- `utils/supabase/server.ts` - Check for console logs
- `verify_directory.ts`, `find_duplicates.ts`, etc. - Script files, acceptable

**Recommendation:** Replace server-side console.log with the logger utility (`lib/logger.ts`)

## Priority: Medium - Archive or Consolidate

### 4. Excessive Documentation (100+ markdown files)

The `docs/` folder contains extensive documentation that should be consolidated:

#### Archive Candidates (Move to `docs/archive/`)

These appear to be historical/completed task reports:

- `docs/archive/COMPLETE_TASKS_SUMMARY.md` - Already archived
- `docs/archive/IMPLEMENTATION_SUMMARY.md` - Already archived
- `docs/archive/*_SUMMARY.md` - All summary files (already archived)
- `docs/STAKEHOLDER-PRESENTATION.md` - Move to archive unless actively used
- `docs/PAYWALL_AUDIT_AND_IMPROVEMENTS.md` - Already completed, should archive
- `docs/SOC2_COMPLIANCE_ROADMAP.md` - If not actively working on this, archive

#### Consolidate Similar Docs

- **Teams Documentation** (10+ files in `docs/teams/`):
  - Consider consolidating into single README with links to specific topics
  - Current: API_LAYER.md, BILLING.md, FRONTEND.md, IMPLEMENTATION.md, etc.
  - Proposed: Single TEAMS_README.md with organized sections

- **Stripe Documentation** (4 files):
  - `STRIPE_CONFIG.md`
  - `STRIPE_INTEGRATION_GUIDE.md`
  - `STRIPE_LOCAL_TESTING.md`
  - `STRIPE_TESTING_CHECKLIST.md`
  - Consider: Single `STRIPE_GUIDE.md` with sections

- **Feature Documentation** (15+ files in `docs/features/`):
  - Many are for planned features (Autonomous Workflows, Token Tracking)
  - Consider: Mark clearly as "Planned", "In Progress", or "Implemented"

### 5. TODO Comments in Code

Found 20+ TODO comments in the codebase. Address or document them:

**Stripe Webhook TODOs** (`app/api/stripe/webhook/route.ts`):

- Lines 90, 146, 199, 258, 302 - All say "TODO: Send to error tracking service (e.g., Sentry)"
- **Recommendation:** Create GitHub issue or decide if Sentry integration is needed

**Rate Limiting** (`lib/rate-limit.ts:19`):

- "TODO: Replace with database-backed rate limiting once migration is run"
- **Recommendation:** Create GitHub issue or accept in-memory approach

**Audit Logging** (`lib/audit-log.ts:34, 66`):

- "TODO: Replace with database logging once migration is run"
- "TODO: In production, send to error tracking service like Sentry"
- **Recommendation:** Create GitHub issues or accept current approach

**Component TODOs**:

- `components/workflows/WorkflowBuilder.tsx:125, 165` - Node palette and configuration
- `components/token-tracking/TokenPreview.tsx:57, 181, 195` - API calls and pricing
- **Recommendation:** These are for unimplemented features - leave or create issues

### 6. Unused/Incomplete Features

These appear to be partially implemented or unused:

**Workflow Builder** (`components/workflows/`):

- `WorkflowBuilder.tsx` - Has TODO comments
- `WorkflowExecutionViewer.tsx` - Placeholder with TODO
- **Status:** Appears incomplete
- **Recommendation:** Either complete, hide from UI, or remove if not needed

**Token Tracking** (extensive docs, partial implementation):

- 10+ documentation files in `docs/features/`
- Component stubs in `components/token-tracking/`
- **Status:** Planned feature with extensive planning docs
- **Recommendation:** Keep docs, mark as "Planned Feature - Not Implemented"

**Agent System** (`lib/agent/test-agent.ts`):

- Single test file for agent system
- **Recommendation:** Move to `scripts/` or proper test directory

## Priority: Low - Nice to Have

### 7. Duplicate or Similar Files

- **Pricing Config:** Both `lib/pricing.ts` and `lib/pricing-server.ts` exist (intentional for client/server split)
- **Stripe Config:** `lib/stripe.ts` and `lib/stripe/client.ts` (client.ts is newer, stripe.ts has backward compat)

### 8. Large Data Files

- `supabase/migrations/20251123000004_add_35_ai_tools.sql` - Large migration with inline data
- `docs/public-prompt-directory-content-strategy.json` - 1000+ lines
- **Recommendation:** Keep as-is, but consider moving large data to separate files if needed

### 9. Unused Scripts

Scripts that may not be actively used:

- `scripts/list_all_tools.ts`
- `scripts/find_broken_tools.ts`
- `scripts/fix-dev-errors.js` (referenced in package.json)
- **Recommendation:** Document purpose or move to `scripts/archive/` if unused

## Files to Keep (Not Bloat)

### Documentation That Should Stay

- `README.md` - Core project documentation
- `CHECKOUT_TROUBLESHOOTING.md` - Recently added, valuable
- `.env.example` - Recently added, essential
- `docs/getting-started/` - User-facing documentation
- `docs/development/` - Developer guides
- `docs/stripe/` - Active integration documentation
- `docs/teams/` - Active feature documentation

### Test Files

- `tests/*.spec.ts` - Playwright tests (keep)
- Note: Some tests have TODO comments for incomplete features

## Immediate Action Items

### Quick Wins (< 30 minutes)

1. ✅ **Delete test output files:**

   ```bash
   rm test-results.txt
   ```

2. ✅ **Move root-level test files to scripts:**

   ```bash
   mv test-pricing.ts scripts/
   mv verify_directory.ts scripts/verify-directory.ts
   mv find_duplicates.ts scripts/find-duplicates.ts
   ```

3. ✅ **Delete deprecated webhook after confirming new one works:**
   ```bash
   rm app/api/webhooks/stripe/route.ts
   mv app/api/webhooks/stripe/DEPRECATED_OLD_WEBHOOK.md docs/archive/
   ```

### Medium Priority (1-2 hours)

4. **Archive completed documentation:**
   - Move completed audit/summary docs to `docs/archive/`
   - Update main README with links to important archived docs

5. **Consolidate related documentation:**
   - Teams docs → Single README with sections
   - Stripe docs → Single guide
   - Feature docs → Clear status labels

6. **Address or document TODOs:**
   - Create GitHub issues for Sentry integration decision
   - Create GitHub issues for database-backed rate limiting
   - Document which TODOs are acceptable vs. need action

### Long-term (Ongoing)

7. **Remove console.log from production code:**
   - Use `lib/logger.ts` for server-side logging
   - Ensure no console statements in production builds

8. **Complete or remove partial features:**
   - Decide on Workflow Builder fate
   - Decide on Token Tracking timeline
   - Update docs to reflect implementation status

## Estimated Impact

### Before Cleanup

- ~100+ markdown documentation files
- Test/debug files in root directory
- Deprecated code still in codebase
- 20+ TODO comments
- Console.log statements in production code

### After Cleanup

- ~60-70 well-organized documentation files
- Clean root directory structure
- No deprecated code
- Documented or addressed TODOs
- Proper logging throughout

### Benefits

- ✅ Easier onboarding for new developers
- ✅ Faster file searching and navigation
- ✅ Clearer understanding of what's implemented vs. planned
- ✅ Reduced technical debt
- ✅ Better code maintainability

## Notes

- This audit found **no critical bugs or security issues**
- Code quality is generally good
- Most "bloat" is documentation and planning artifacts
- The codebase is well-structured despite the extra files
- SEO has been improved on About, Product, and Directory pages
- Checkout error handling has been significantly improved

## Summary

**Total Files Recommended for Removal:** 4-5 immediate
**Total Files Recommended for Archiving:** 20-30 documentation files
**Total TODOs to Address:** 20+
**Estimated Cleanup Time:** 2-4 hours
**Estimated Impact:** Moderate improvement in maintainability
