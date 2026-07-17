# PharmaSync Tooling Assessment

**Date**: 2026-07-17  
**Task**: TASK-017  
**Status**: In Progress

---

## Executive Summary

This document assesses the tooling options for the PharmaSync monorepo against the project's architecture (ADR-0005: Modular Monolith in Monorepo), compliance requirements (ADR-0004: Evidence Generation), and team workflow needs.

**Current Stack**: pnpm + Turborepo + TypeScript + AdonisJS (API) + Vue/Vite (Web) + Lefthook + Commitlint + Release Please

---

## 1. Package Management & Monorepos

| Tool | Verdict | Rationale |
|------|---------|-----------|
| **pnpm** | ✅ **Keep** | Already in use. Fast, disk-efficient, excellent workspace protocol support. Required by Turborepo. |
| **Turborepo** | ✅ **Keep** | Already in use. Best-in-class task caching/pipelines for monorepos. Low config, high value. |
| **Nx** | ❌ **Skip** | Overkill for modular monolith. Adds complexity (affected commands, generators) not needed at this scale. |
| **moon** | ❌ **Skip** | Rust-based, less mature ecosystem. Turborepo covers needs. |
| **Bazel** | ❌ **Skip** | Extreme complexity. Only justified at Google-scale with dedicated infra team. |
| **Buck2 / Pants** | ❌ **Skip** | Same as Bazel. |
| **Rush Stack** | ❌ **Skip** | Microsoft-heavy, complex config. Turborepo + pnpm simpler. |
| **Bun** | ⚠️ **Watch** | Promising but AdonisJS/Vite ecosystem not fully validated. Revisit when AdonisJS 7+ has official Bun support. |

---

## 2. Formatting & Linting

| Tool | Verdict | Rationale |
|------|---------|-----------|
| **Prettier** | ✅ **Keep** | Standard formatter. Already configured per-app (AdonisJS config, Vue config). |
| **ESLint** | ✅ **Keep** | Required for TypeScript/Vue/AdonisJS rules. Per-app configs appropriate. |
| **Biome** | ❌ **Skip** | Would replace Prettier+ESLint. Migration cost > benefit. Oxc-based tools still maturing. |
| **Oxc (Oxlint + Oxfmt)** | ⚠️ **Watch** | Fast Rust-based. Adopt via Vite/Rolldown when stable. Not a drop-in replacement yet. |
| **eslint-plugin-unicorn** | ✅ **Add** | Catches modern JS best practices. Low cost, high signal. |
| **eslint-plugin-vue** | ✅ **Keep** | Required for Vue 3 + TypeScript. Already in web package. |
| **@typescript-eslint** | ✅ **Keep** | Implied by AdonisJS/Vue ESLint configs. |
| **GritQL** | ❌ **Skip** | Pattern-based codemods. Not needed for current scale. |

---

## 3. TypeScript & Build Tools

| Tool | Verdict | Rationale |
|------|---------|-----------|
| **TypeScript** | ✅ **Keep** | Core language. v5.7 in use. |
| **TypeScript 7 (Go-native)** | ⚠️ **Watch** | Major speedup coming. Adopt via TS upgrade when stable. |
| **Vite** | ✅ **Keep** | Web app dev server + build. Mature, fast. |
| **@adonisjs/vite** | ✅ **Keep** | AdonisJS integration for HMR/SSR. Required by ADR-0007. |
| **tsdown** | ❌ **Skip** | Library bundler. PharmaSync builds apps, not libraries. |
| **unbuild** | ❌ **Skip** | Same — library-focused. |
| **pkgroll / tsup** | ❌ **Skip** | Library bundlers. |
| **Rolldown** | ⚠️ **Watch** | Vite's future Rust bundler. Will inherit via Vite upgrade. |
| **ttsc / @ttsc** | ❌ **Skip** | Experimental. Not production-ready. |

---

## 4. Code Health & Hygiene

| Tool | Verdict | Rationale |
|------|---------|-----------|
| **Knip** | ✅ **Add** | Finds unused exports, dependencies, files. Critical for monorepo hygiene. |
| **dependency-cruiser** | ✅ **Add** | Enforces module boundaries (ADR-0005). Prevents circular deps, layer violations. |
| **rev-dep** | ❌ **Skip** | Redundant with Knip + dependency-cruiser. |
| **Repomix** | ❌ **Skip** | Packs repo for LLM context. Not a CI tool. |
| **SonarQube** | ❌ **Skip** | Heavy, requires server. Overkill for pilot phase. |
| **CodeQL** | ✅ **Add to CI** | Free for OSS, GitHub-native. Security analysis fits compliance (ADR-0004). |

---

## 5. Git Hooks & Workflow

| Tool | Verdict | Rationale |
|------|---------|-----------|
| **Husky** | ❌ **Replace** | Lefthook is faster, simpler config, already set up. |
| **lint-staged** | ✅ **Keep** | Works with Lefthook. Runs formatters on staged files. |
| **Lefthook** | ✅ **Keep** | Go binary, fast, supports pre-commit + commit-msg. Already configured. |
| **Commitlint** | ✅ **Keep** | Enforces conventional commits for Release Please. Just added. |
| **Commitizen** | ❌ **Skip** | Interactive CLI. Commitlint enforcement is sufficient. |
| **Changesets** | ❌ **Skip** | Release Please handles versioning + changelog. Duplicate. |

---

## 6. Testing & QA

| Tool | Verdict | Rationale |
|------|---------|-----------|
| **Vitest** | ✅ **Add to API + Worker** | Already in web. Fast, Vite-native, TypeScript-first. Unit/integration tests. |
| **Playwright** | ✅ **Add to Web** | E2E for dashboard. Critical for pilot demo credibility. Multi-browser. |
| **Cypress** | ❌ **Skip** | Playwright is faster, better DX, multi-browser. |
| **Storybook** | ❌ **Skip** | Component docs. Overkill for internal ops dashboard. |

---

## 7. AdonisJS-Specific

| Tool | Verdict | Rationale |
|------|---------|-----------|
| **AdonisJS Core** | ✅ **Keep** | Framework choice (ADR-0007). |
| **@adonisjs/eslint-config** | ✅ **Keep** | Provides Adonis-aware rules. |
| **@adonisjs/prettier-config** | ✅ **Keep** | Consistent formatting. |

---

## 8. Architecture & Enforcement

| Tool | Verdict | Rationale |
|------|---------|-----------|
| **eslint-plugin-packlets** | ❌ **Skip** | Rush Stack tool. Use `dependency-cruiser` for boundary enforcement. |

---

## 9. AI / Agent Tools

| Tool | Verdict | Rationale |
|------|---------|-----------|
| **Archon** | ❌ **Skip** | External agent framework. Not relevant. |
| **MCP code graphs** | ❌ **Skip** | Experimental. |
| **ContextKit** | ❌ **Skip** | Experimental. |

---

## 10. Other Libraries & Patterns

| Tool | Verdict | Rationale |
|------|---------|-----------|
| **Zod** | ⚠️ **Evaluate** | VineJS (AdonisJS) handles backend validation. Only needed if sharing schemas with web. |
| **Valibot** | ❌ **Skip** | Smaller bundle. VineJS covers backend. |
| **Tailwind CSS** | ✅ **Keep** | Already in web (ADR-0006). |
| **shadcn/vue** | ❌ **Skip** | Nuxt UI + Reka UI chosen (ADR-0006). Duplicate. |
| **UnoCSS** | ❌ **Skip** | Tailwind already chosen. |
| **Effect.ts** | ❌ **Skip** | FP-heavy. AdonisJS/Lucid use different patterns. |
| **ts-pattern** | ✅ **Add** | Pattern matching for domain logic (signals, integration mapping). Lightweight, no runtime deps. |

---

## Implementation Priority

### Phase 1: Immediate (This Sprint)
1. **Add Knip** — Root config, run in CI
2. **Add dependency-cruiser** — Root config with layer rules, run in CI
3. **Add eslint-plugin-unicorn** — Root ESLint config
4. **Add Vitest to API + Worker** — Unit/integration test setup
5. **Add Playwright to Web** — E2E test setup
6. **Enable CodeQL** — GitHub Actions workflow

### Phase 2: Next Sprint
7. **Add ts-pattern** — Domain + integration packages
8. **Evaluate Zod** — Only if web needs shared validation schemas

### Phase 3: Ongoing
9. **Watch TypeScript 7 / Rolldown / Oxc** — Adopt via framework upgrades

---

## Configuration Files to Create

| File | Purpose |
|------|---------|
| `knip.json` | Knip configuration (entry points, ignore patterns) |
| `.dependency-cruiser.json` | Layer rules: apps → packages, no cycles, no cross-package shortcuts |
| `.eslintrc.js` (root) | Shared ESLint config with unicorn plugin |
| `vitest.config.ts` (api, worker) | Vitest setup per package |
| `playwright.config.ts` (web) | Playwright E2E config |
| `.github/workflows/codeql.yml` | CodeQL analysis workflow |

---

## Acceptance Criteria

- [ ] All Phase 1 tools installed and configured
- [ ] CI pipeline runs: `knip`, `dependency-cruiser`, `eslint`, `typecheck`, `test`, `build`
- [ ] CodeQL workflow runs on push/PR
- [ ] No unused exports/dependencies reported by Knip
- [ ] No architecture violations reported by dependency-cruiser
- [ ] Documentation updated in `docs/tooling-assessment.md`