# Hop On: AI Engineering Guidelines

This document serves as a foundational mandate for all AI agents (Gemini CLI) working on this project. Adherence to these standards is non-negotiable.

## 1. Development Principles

- **TDD First:** Never write implementation code without a corresponding failing test. Follow the Red-Green-Refactor cycle strictly.
- **Pure Temporal Logic:** All itinerary logic must be time-driven and decoupled from physical IDs or rigid hierarchies. The timeline is a flat array; grouping is virtual.
- **Service-Oriented Architecture:** Maintain strict separation between the API (Hono/Drizzle), the Web UI (React/Vite), and the DB (PostgreSQL).

## 2. Technical Standards

- **Linting:** Use **Oxlint** exclusively for linting. No ESLint.
- **TypeScript:** Enforce the strictest possible settings (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`).
- **Formatting:** Prettier must run on every commit.
- **Documentation:** Every core business logic function MUST have JSDoc comments explaining its intent, parameters, and return value.
- **Persistence:** Use **Drizzle ORM** with PostgreSQL. Keep the database portable and Dockerized.

## 3. Workflow Mandates

- **Pre-commit Quality Gates:** Every commit must pass `tsc --noEmit`, `oxlint`, and `prettier` checks.
- **Context Preservation:** Always update `TODO.md` after completing a sub-task.
- **Surgical Updates:** When modifying files, preserve existing patterns and types.
- **Zero-link Persistence:** Avoid hardcoded IDs for relationships in the frontend logic; use temporal scopes.

## 4. Visual Standards (UI)

- **Theme:** "Zinc/Dark" professional theme.
- **Density:** High-density rows designed for information richness.
- **Feedback:** UI must feel "alive" with transitions and interactive state synchronization.

---

_Generated on 2026-05-01 for the Hop On Project._
