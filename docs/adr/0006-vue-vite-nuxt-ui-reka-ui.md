---
id: ADR-0006
title: Use Vue and Vite with Nuxt UI and Reka UI
status: accepted
date: 2026-07-17
owners: [frontend, architecture]
decision_area: frontend
tags: [vue, vite, nuxt-ui, reka-ui, dashboard]
supersedes: []
superseded_by: null
related: [ADR-0005]
---

# ADR-0006: Use Vue and Vite with Nuxt UI and Reka UI

## Context

PharmaSync needs an operations dashboard for inventory, signals, integration health, quarantine, and audit evidence.

## Decision

Use Vue 3 with Vite. Use Nuxt UI as the primary component system and Reka UI for lower-level accessible primitives.

## Rationale

- Vue + Vite keeps the dashboard focused and independently deployable.
- Nuxt UI supports Vue/Vite through its Vite plugin and provides production-ready components.
- Reka UI gives accessible primitives for custom controls not covered by Nuxt UI.

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
|---|---|---|---|---|
| Vue + Vite + Nuxt UI/Reka UI | Focused dashboard architecture | Requires explicit routing and app conventions | Medium | Current Phase 1 |
| Nuxt full app | Strong conventions and SSR option | Heavier than needed for an operations dashboard | Medium | Public/SSR app |
| React | Large ecosystem | Rejected product preference | Medium | Not applicable |

## Trade-offs

- No SSR by default.
- Some Nuxt UI conventions must be configured explicitly for Vite.

## Consequences

- Positive: Accessible dashboard with a strong Vue component foundation.
- Negative: More manual app wiring than Nuxt.
- Mitigation: Keep frontend architecture simple and component-driven.

## Revisit Triggers

- SSR, public SEO pages, or Nuxt modules become product requirements.
