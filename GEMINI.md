# Hop On: AI Engineering Guidelines

This document serves as a foundational mandate for all AI agents (Gemini CLI) working on this project. Adherence to these standards is non-negotiable.

## 1. Development Principles

- **TDD First:** Never write implementation code without a corresponding failing test. Follow the Red-Green-Refactor cycle strictly.
- **Pure Temporal Logic:** All itinerary logic must be time-driven and decoupled from physical IDs or rigid hierarchies. The timeline is a flat array; grouping is virtual.
- **Service-Oriented Architecture:** Maintain strict separation between the API (Hono/Drizzle), the Web UI (React/Vite), and the DB (PostgreSQL).

## 2. Technical Standards

- **Atomic Modularity:** NEVER create large functions or components. Every function, component, hook, or service MUST do exactly one thing.
- **Composition over Inheritance:** Prefer small, composed units. Use hooks for stateful logic, services for data fetching/processing, and factories for complex object creation.
- **Linting:** Use **Oxlint** exclusively for linting. No ESLint.
- **TypeScript:** Enforce the strictest possible settings (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`).
- **Formatting:** Prettier must run on every commit.
- **Documentation:** Every core business logic function MUST have JSDoc comments explaining its intent, parameters, and return value.
- **Persistence:** Use **Drizzle ORM** with PostgreSQL. Keep the database portable and Dockerized.

## 3. Workflow Mandates

- **Directives only:** Never start a new Milestone, major feature, or architectural section without explicit verbal confirmation from the user in the current turn.
- **Test-Driven Everything:** Every new component, hook, or utility MUST have a corresponding unit test file.
- **High-Level Integrity:** Critical pages and user flows MUST have high-level integration tests (Page Integrity Tests) to catch build-time and runtime failures.
- **Zero Visual Errors:** I should never see an error on screen. Every potential failure path (API down, missing data, 404) MUST be handled by a professional Error Boundary or Fallback UI.
- **No Automatic Pushes:** NEVER push changes to the remote repository (`git push`) without explicit verbal confirmation from the user in the current turn.
- **Pre-commit Quality Gates:** Every commit must pass `tsc --noEmit`, `oxlint`, and `prettier` checks.
- **Context Preservation:** Always update `TODO.md` after completing a sub-task.
- **Surgical Updates:** When modifying files, preserve existing patterns and types.
- **Zero-link Persistence:** Avoid hardcoded IDs for relationships in the frontend logic; use temporal scopes.

## 4. Visual Standards (UI)

- **Theme:** "Slate & Indigo" sophisticated professional theme. Deep charcoal slate for dark mode, soft pearl slate for light mode.
- **Accents:** Use Indigo for primary actions and indicators to provide depth beyond monochromatic.
- **Density:** High-density rows designed for information richness.
- **Feedback:** UI must feel "alive" with transitions and interactive state synchronization.

---

_Generated on 2026-05-01 for the Hop On Project._
