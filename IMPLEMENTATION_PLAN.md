# Hop On: Professional Implementation Roadmap

This document outlines the step-by-step, TDD-driven development process for the Hop On travel planner. We follow a "Foundation-First" approach, ensuring the core logic and infrastructure are bulletproof before the UI is realized.

---

## Milestone 1: Monorepo & Infrastructure Orchestration
**Goal:** Establish the development environment and service isolation.

1.  **Monorepo Initialization:**
    *   Setup a Monorepo using `npm workspaces`.
    *   Folders: `packages/core` (shared logic/types), `apps/api` (backend), `apps/web` (frontend).
2.  **Docker Orchestration:**
    *   Define `docker-compose.yml` with three services: `postgres:16`, `hopon-api`, and `hopon-web`.
    *   Setup a persistent volume for Postgres to preserve dev data.
3.  **CI/Testing Foundation:**
    *   Install **Vitest** across all packages.
    *   Configure global linting (ESLint) and formatting (Prettier).

---

## Milestone 2: Domain Logic (The "Temporal Brain")
**Goal:** Implement the "Pure Temporal" logic using 100% TDD in `packages/core`.

1.  **Requirement: Event Sorting & Grouping**
    *   **TDD:** Write tests for `groupEventsByBase()`.
    *   **Logic:** Sort flat events by time and group them based on the "temporal scope" of `STAY` events.
2.  **Requirement: The Time-Slice Shifter**
    *   **TDD:** Write tests for `calculateOffsetShift()`.
    *   **Logic:** Ensure that shifting a Stay by +X days correctly applies the exact millisecond offset to all activities within that slice.
3.  **Requirement: Gap Detection**
    *   **TDD:** Write tests for `identifyItineraryGaps()`.
    *   **Logic:** Identify dates where no `STAY` exists and return the exact missing intervals.

---

## Milestone 3: Persistence Layer (Data Service)
**Goal:** Build a robust, type-safe data access layer in `apps/api`.

1.  **Drizzle Schema Definition:**
    *   Define tables for `users`, `trips`, `permissions`, and `events` in TypeScript.
2.  **Migration Workflow:**
    *   Setup **Drizzle Kit** to manage local migrations.
    *   **TDD:** Write "Repository Tests" using a test database container to verify CRUD operations and constraints.
3.  **Auth Integration (Phase 1):**
    *   Implement an Auth middleware that validates Social Login tokens (Mocked locally for dev).

---

## Milestone 4: The Service Layer (API Endpoints)
**Goal:** Expose the logic via a RESTful API.

1.  **Trip Management Endpoints:**
    *   **TDD:** Integration tests for `POST /trips` and `GET /trips` (enforce privacy/ownership).
2.  **Itinerary Operations:**
    *   **TDD:** Integration tests for `PATCH /trips/:id/shift` (integrating Core Logic from Milestone 2).
3.  **Permissions & Sharing:**
    *   **TDD:** Verify that a user with `viewer` role cannot perform mutation operations.

---

## Milestone 5: UI Foundations & Zinc Design System
**Goal:** Build the visual language and state management in `apps/web`.

1.  **Zinc/Dark Design System:**
    *   Implement "Professional Dark" theme using Vanilla CSS variables.
    *   **TDD:** Component unit tests for high-density rows.
2.  **State Management:**
    *   Setup **TanStack Query** for server state and **Zustand** for local UI state.
3.  **API Client:**
    *   Generate a type-safe API client using shared types from `packages/core`.

---

## Milestone 6: High-Density Itinerary & Mapping
**Goal:** Realize the functional specification with interactive features.

1.  **The Base-Centric List:**
    *   Render the grouped itinerary.
    *   **TDD:** Verify "Amber Alerts" appear for identified gaps.
2.  **Drag-and-Drop Implementation:**
    *   Implement dnd for activities and Base Groups.
    *   **Interaction TDD:** Mock API responses to verify optimistic UI updates.
3.  **Spatial Sync (Map Integration):**
    *   Integrate Leaflet.
    *   Implement "Visual Thread" (Chronological Pathing) connecting event coordinates.
    *   **Sync Logic:** Hover/Scroll synchronization between Itinerary and Map.

---

## Milestone 7: Refinement & Mobile Preparation
**Goal:** Finalize polish and ensure cross-platform readiness.

1.  **System Safeguards:**
    *   Enforce "Locked" status for Check-in/out in the UI.
2.  **Cloning/Duplication Workflow:**
    *   Implement "Duplicate Trip" functionality.
3.  **Mobile Audit:**
    *   Verify `/core` logic independence from browser APIs.
