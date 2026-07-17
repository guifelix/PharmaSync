
<!-- BACKLOG.MD GUIDELINES START -->
<!-- backlog.md-instructions-version: 1.48.0 -->
<CRITICAL_INSTRUCTION>

## Backlog.md Workflow

This project uses Backlog.md for task and project management.

**For every user request (that is related to create/modify/delete files) in this project, run `backlog instructions overview` before answering or taking action.**

Use the overview to decide whether to search, read, create, or update Backlog tasks.

Before task lifecycle actions, read the matching detailed guide:
- `backlog instructions task-creation` before creating or splitting tasks
- `backlog instructions task-execution` before planning, changing status or assignee, adding a plan or implementation notes, or implementing task work
- `backlog instructions task-finalization` before checking acceptance criteria, writing final summaries, or moving tasks to terminal statuses

Use `backlog <command> --help` before running unfamiliar commands. Help shows options, fields, and examples.

Do not edit Backlog task, draft, document, decision, or milestone markdown files directly. Use the `backlog` CLI so metadata, relationships, and history stay consistent.

## Version Control

- use conventional commits (without emojis): https://raw.githubusercontent.com/conventional-commits/conventionalcommits.org/refs/heads/master/content/v1.0.0/index.md
- use atomic commits
- use trunk based development: https://trunkbaseddevelopment.com/

## Development Workflow

For any work that creates, modifies, or deletes project files, use this workflow:

1. **Backlog first**
   - Search for an existing task before creating a new one.
   - Do not start implementation until the active Backlog task has acceptance criteria, Definition of Done, dependencies where relevant, references, and an implementation plan.
   - Mark the task `In Progress` and assign yourself before editing code.

2. **Architecture check**
   - Read relevant ADRs in `docs/adr/` and system-design docs before changing architecture, boundaries, persistence, integration contracts, security posture, or deployment behavior.
   - Create a new ADR or supersede/update an existing ADR when the change is architecture-significant.
   - Do not use ADRs for ordinary code changes that are already covered by existing decisions.

3. **TDD / test-first default**
   - Prefer test-first development for business rules, domain behavior, API contracts, integration adapters, security checks, and bug fixes.
   - Follow red-green-refactor: write or update a failing test, make the smallest change that passes, then refactor while tests stay green.
   - When strict test-first is not practical, record why in the Backlog implementation notes and add the missing tests in the same task.

4. **Small-batch implementation**
   - Work in the smallest coherent slice that satisfies the task acceptance criteria.
   - Keep changes aligned with the modular monolith boundaries: domain packages, contracts, Adonis API, Vue app, worker, infra, and docs should change only when the task requires it.
   - Avoid speculative abstractions, premature microservices, and broad refactors outside the active task.
   - Keep trunk releasable: do not leave broken typechecks, failing tests, or half-applied migrations.

5. **Contract and data discipline**
   - Update OpenAPI contracts before or alongside API behavior changes.
   - Keep shared package types, database migrations/models, API responses, and frontend consumers aligned.
   - For integration work, preserve trace IDs, idempotency behavior, quarantine behavior, and audit evidence paths.
   - For regulated-data-adjacent work, minimize sensitive data, avoid PHI in fixtures, and audit security-relevant actions.

6. **Validation before handoff**
   - Run the narrowest relevant check first, then broader checks when the blast radius requires it.
   - Typical checks include `pnpm --filter <package> typecheck`, package tests, `pnpm typecheck`, API contract validation, migration checks, and UI build/accessibility checks when frontend behavior changes.
   - Record validation commands and results in the Backlog task notes.

7. **Task finalization**
   - Check acceptance criteria and Definition of Done through the Backlog CLI.
   - Add implementation notes and a final summary.
   - Move the task to `Done` only after the work is implemented, validated, documented, and ready to commit.
   - Commit the completed task as an atomic Conventional Commit. Do not mix unrelated task work in the same commit.


</CRITICAL_INSTRUCTION>
<!-- BACKLOG.MD GUIDELINES END -->
