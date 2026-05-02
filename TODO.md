# Hop On: Project Status Tracker (TODO)

This file tracks the granular progress of the implementation. Each step follows a strict TDD approach and professional engineering standards.

## Milestone 1: Monorepo & Infrastructure Orchestration (DONE)

- [x] Initialize Monorepo (Packages: core, api, web)
- [x] Configure TypeScript Project References
- [x] Setup Dockerized PostgreSQL 16
- [x] Setup Drizzle ORM & Migrations

## Milestone 2: Temporal Logic "The Brain" (DONE)

- [x] [TDD] Implement `groupEventsByBase` logic
- [x] [TDD] Implement `identifyItineraryGaps` logic
- [x] [TDD] Implement `shiftEvents` logic

## Milestone 3: Secure API & Repositories (DONE)

- [x] [TDD] Implement `UserRepository` & `TripRepository`
- [x] [TDD] Implement `EventRepository` (Security-First)
- [x] [TDD] Audit Security Roles (Owner, Editor, Viewer)

## Milestone 4: Hono API Routing (DONE)

- [x] Setup Hono Server with Drizzle
- [x] Implement `/trips` and `/events` endpoints
- [x] Setup Mock Auth via `x-user-id` header

## Milestone 5: UI Foundations & Trip Lifecycle (DONE)

- [x] Setup React/Vite/Tailwind v4 / Theme Switcher
- [x] [Refactor] Centralize `CONFIG` and custom fetch hooks
- [x] [Refactor] Extract `TripForm` for shared logic
- [x] [TDD] Achieve 100% component test coverage
- [x] Implement Trip Creation, Editing, and Deletion with validation
- [x] Add Toast notifications (sonner) for live feedback

## Milestone 6: High-Density Itinerary Timeline (CURRENT)

- [ ] **M6.1: Visual Nesting (The Threaded Layout)**
  - [ ] [TDD] Create `components/itinerary/base-group.tsx`
  - [ ] Implement vertical "Thread" line connecting stays to nested activities
  - [ ] Update `ItineraryRow` for high-density variants (Stay vs Activity)
- [ ] **M6.2: Temporal Structure & Gap Visuals**
  - [ ] Implement virtual "Day X" headers within the timeline
  - [ ] Build functional "Amber Alert" cards for identified gaps
- [ ] **M6.3: Entry Management**
  - [ ] [TDD] Implement `AddEventDialog` with Type selection
  - [ ] Integrate add/edit actions directly in the timeline rows

## Milestone 7: Spatial Logic & Mapping

- [ ] **M7.1: Leaflet Engine Integration**
  - [ ] Setup interactive map in the inspector panel
- [ ] **M7.2: Visual Threading**
  - [ ] Synchronize map selection with timeline hover
- [ ] **M7.3: Route Visualization**
  - [ ] Draw travel paths between itinerary locations

## Milestone 8: Advanced Logic & Polish

- [ ] **M8.1: Deep-Clone Logic**
  - [ ] [TDD] Implement and test trip duplication
- [ ] **M8.2: Mobile Layout Audit**
  - [ ] Optimize density for small-screen viewports
