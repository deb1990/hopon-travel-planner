# Hop On: Project Status Tracker (TODO)

This file tracks the granular progress of the implementation. Each step follows a strict TDD approach and professional engineering standards.

## Milestone 1: Monorepo & Infrastructure Orchestration

- [x] **M1.1: Monorepo Setup**
  - [x] Initialize root `package.json` with npm workspaces (`packages/core`, `apps/api`, `apps/web`)
  - [x] Create folder structure for `packages/core`, `apps/api`, and `apps/web`
  - [x] Initialize `package.json` for `packages/core`
  - [x] Initialize `package.json` for `apps/api`
  - [x] Initialize `package.json` for `apps/web`
- [x] **M1.2: Docker Configuration**
  - [x] Create `.env.example` with database credentials
  - [x] Create `docker-compose.yml`
  - [x] Configure `postgres:16` service with persistent volume
  - [x] Create Dockerfile placeholder for `apps/api`
  - [x] Create Dockerfile placeholder for `apps/web`
  - [x] Verify `docker compose up` starts the database correctly
- [x] **M1.3: Tooling & Testing Foundation**
  - [x] Install `vitest` in root and configure for workspace-wide testing
  - [x] Configure root `eslint` with TypeScript support
  - [x] Configure root `prettier`
  - [x] Add `test`, `lint`, and `format` scripts to root `package.json`

## Milestone 2: Domain Logic (The "Temporal Brain")

- [x] **M2.1: Event Grouping (TDD)**
  - [x] Define shared Types in `packages/core/src/types`
  - [x] Create `packages/core/src/temporal/grouping.test.ts`
  - [x] [RED] Write failing test for `groupEventsByBase`
  - [x] [GREEN] Implement basic grouping logic
  - [x] [REFACTOR] Optimize grouping for large timelines
- [x] **M2.2: Time-Slice Shifting (TDD)**
  - [x] Create `packages/core/src/temporal/shifting.test.ts`
  - [x] [RED] Write failing test for millisecond-accurate shifting
  - [x] [GREEN] Implement `calculateOffsetShift` logic
  - [x] [RED] Write test for shifting edge cases (Leap years/Timezones)
  - [x] [GREEN] Fix edge cases
- [x] **M2.3: Gap Detection (TDD)**
  - [x] Create `packages/core/src/temporal/gaps.test.ts`
  - [x] [RED] Write failing test for gap identification between stays
  - [x] [GREEN] Implement `identifyItineraryGaps`
  - [x] [RED] Write test for "No Stay" beginning/end scenarios

## Milestone 3: Persistence Layer (Data Service)

- [x] **M3.1: Drizzle Schema Definition**
  - [x] Setup Drizzle in `apps/api`
  - [x] Define `users`, `trips`, `permissions`, and `itinerary_events` table schemas
- [x] **M3.2: Migrations & DB Connectivity**
  - [x] Configure `drizzle-kit` for migrations
  - [x] Generate initial SQL migration files
  - [x] Implement database connection singleton
  - [x] Apply initial migration to local DB
- [x] **M3.3: Repository Pattern (TDD)**
  - [x] Create `apps/api/src/repositories/events.test.ts`
  - [x] [RED] Test basic CRUD for events
  - [x] [GREEN] Implement EventRepository
  - [x] [RED] Test ownership/privacy constraints at DB level
- [x] **M3.4: Trip & Permission Repository (TDD)**
  - [x] Implement `TripRepository` for sharing logic
  - [x] [TDD] Verify permission-based access listing
- [x] **M3.5: User Repository (TDD)**
  - [x] Implement `UserRepository` for auth-related lookups
  - [x] [TDD] Verify upsert logic for social login profile sync

## Milestone 4: The Service Layer (API Endpoints)

- [x] **M4.1: API Boilerplate**
  - [x] Setup Hono/Express server in `apps/api`
  - [x] Implement error handling and logging middleware
- [x] **M4.2: Core Endpoints (TDD)**
  - [x] [TDD] Integration tests for `GET /trips`
  - [x] [TDD] Integration tests for `POST /trips/:id/events`
  - [x] [TDD] Integration tests for `PATCH /trips/:id/shift` (Connecting Core Logic)
- [x] **M4.3: Auth & Permissions**
  - [x] Implement mock Auth provider for local dev
  - [x] [TDD] Verify permission middleware blocks unauthorized edits

## Milestone 5: UI Foundations & Zinc Design System

- [x] **M5.1: Design System**
  - [x] Setup Tailwind v4 with PostCSS for Next.js
  - [x] Implement Ultra-Premium Zinc/Void theme
  - [x] Build high-fidelity `Card`, `Button`, and `Row` components
  - [x] [TDD] Component tests for premium Row variants

- [x] **M5.2: State & Client**
  - [x] Setup TanStack Query and QueryProvider
  - [x] Create API-driven main dashboard (`app/page.tsx`)
- [x] **M5.3: Trip Management UI**
  - [x] Create `components/dashboard/trip-card.tsx`
  - [x] Implement `GET /trips` list view on home page
  - [x] Implement `POST /trips` (Create Trip) modal/form
  - [x] Add navigation between Dashboard and Itinerary View
- [x] **M5.4: Trip Lifecycle (Create & Delete)**
  - [x] [TDD] Add `delete` method to `TripRepository` and verify with tests
  - [x] [TDD] Implement `DELETE /trips/:id` with ownership verification
  - [x] Build `components/dashboard/create-trip-dialog.tsx`
  - [x] Add Delete action to `TripCard` with a Confirmation Modal
  - [x] Implement optimistic UI updates for deletion
- [ ] **M5.5: Trip Date Range Support**
  - [x] [DB] Add `startDate` and `endDate` to `trips` table
  - [x] [API] Update `TripRepository` and `POST /trips` to handle dates
  - [x] [UI] Add Date Pickers to `CreateTripDialog`
  - [x] [UI] Display trip date range on `TripCard`
- [x] **M5.6: Trip Editing UI**
  - [x] [API] Add `update` method to `TripRepository`
  - [x] [API] Implement `PATCH /trips/:id` endpoint
  - [x] Build `components/dashboard/edit-trip-dialog.tsx`
  - [x] Add Edit action to `TripCard`
- [x] **M5.7: Process Integrity**
  - [x] Implement "Two-Turn Handshake" in `GEMINI.md`
  - [x] Add PUSH tracking to `TODO.md`
  - [x] PUSH AUTHORIZED (Archived)

## Milestone 6: High-Density Itinerary & Mapping

- [ ] **M6.1: The Itinerary List**
  - [ ] Implement virtual grouping in the UI
  - [ ] Integrate "Amber Alert" visual for gaps
- [ ] **M6.2: Mapping**
  - [ ] Setup Leaflet map component
  - [ ] Implement chronological pathing logic (The Thread)
  - [ ] Implement Bi-directional hover sync (Map <-> List)

## Milestone 7: Refinement

- [ ] **M7.1: UI Polish**
  - [ ] Add transitions and "Alive" UI feedback
  - [ ] Enforce protected (locked) status in UI
- [ ] **M7.2: Duplication Logic**
  - [ ] [TDD] Implement and test deep-clone logic for trips
- [ ] **M7.3: Mobile Prep Audit**
  - [ ] Final package verification for future React Native use
