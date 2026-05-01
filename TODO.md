# Hop On: Project Status Tracker (TODO)

This file tracks the granular progress of the implementation. Each step follows a strict TDD approach and professional engineering standards.

## Milestone 1: Monorepo & Infrastructure Orchestration
- [ ] **M1.1: Monorepo Setup**
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
- [ ] **M2.1: Event Grouping (TDD)**
    - [ ] Define shared Types in `packages/core/src/types`
    - [ ] Create `packages/core/src/temporal/grouping.test.ts`
    - [ ] [RED] Write failing test for `groupEventsByBase`
    - [ ] [GREEN] Implement basic grouping logic
    - [ ] [REFACTOR] Optimize grouping for large timelines
- [ ] **M2.2: Time-Slice Shifting (TDD)**
    - [ ] Create `packages/core/src/temporal/shifting.test.ts`
    - [ ] [RED] Write failing test for millisecond-accurate shifting
    - [ ] [GREEN] Implement `calculateOffsetShift` logic
    - [ ] [RED] Write test for shifting edge cases (Leap years/Timezones)
    - [ ] [GREEN] Fix edge cases
- [ ] **M2.3: Gap Detection (TDD)**
    - [ ] Create `packages/core/src/temporal/gaps.test.ts`
    - [ ] [RED] Write failing test for gap identification between stays
    - [ ] [GREEN] Implement `identifyItineraryGaps`
    - [ ] [RED] Write test for "No Stay" beginning/end scenarios

## Milestone 3: Persistence Layer (Data Service)
- [ ] **M3.1: Drizzle Schema Definition**
    - [ ] Setup Drizzle in `apps/api`
    - [ ] Define `users` table schema
    - [ ] Define `trips` table schema
    - [ ] Define `permissions` table schema
    - [ ] Define `events` table schema
- [ ] **M3.2: Migrations & DB Connectivity**
    - [ ] Configure `drizzle-kit` for migrations
    - [ ] Generate initial SQL migration files
    - [ ] Implement database connection singleton
- [ ] **M3.3: Repository Pattern (TDD)**
    - [ ] Create `apps/api/src/repositories/events.test.ts`
    - [ ] [RED] Test basic CRUD for events
    - [ ] [GREEN] Implement EventRepository
    - [ ] [RED] Test ownership/privacy constraints at DB level

## Milestone 4: The Service Layer (API Endpoints)
- [ ] **M4.1: API Boilerplate**
    - [ ] Setup Hono/Express server in `apps/api`
    - [ ] Implement error handling and logging middleware
- [ ] **M4.2: Core Endpoints (TDD)**
    - [ ] [TDD] Integration tests for `GET /trips`
    - [ ] [TDD] Integration tests for `POST /trips/:id/events`
    - [ ] [TDD] Integration tests for `PATCH /trips/:id/shift` (Connecting Core Logic)
- [ ] **M4.3: Auth & Permissions**
    - [ ] Implement mock Auth provider for local dev
    - [ ] [TDD] Verify permission middleware blocks unauthorized edits

## Milestone 5: UI Foundations & Zinc Design System
- [ ] **M5.1: Design System**
    - [ ] Setup CSS Variables in `apps/web/src/styles/theme.css`
    - [ ] Build `Card`, `Button`, and `Row` base components
    - [ ] [TDD] Component tests for Row variants (Activity vs Stay)
- [ ] **M5.2: State & Client**
    - [ ] Setup TanStack Query and Zustand
    - [ ] Create API Client wrapper using `fetch`

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
