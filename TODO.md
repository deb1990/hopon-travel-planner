# Hop On: Project Status Tracker (TODO)

This file tracks the granular progress of the implementation. Each step follows a strict TDD approach and professional engineering standards.

## Milestone 1: Monorepo & Infrastructure Orchestration (DONE)

- [x] Initialize Monorepo (Packages: core, api, web)
- [x] Configure TypeScript Project References
- [x] Setup Dockerized PostgreSQL 16
- [x] Setup Drizzle ORM & Migrations

## Milestone 2: Temporal Logic "The Brain" (DONE)

- [x] [TDD] Implement `groupEventsByDay` logic
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

## Milestone 6: High-Density Day-Centric Timeline (DONE)

- [x] **M6.1: Day-Centric Refactor**
  - [x] [TDD] Replace Stay-centric grouping with strict Day-centric containers
  - [x] Implement transition day mastery (Multi-stay support per day)
  - [x] Implement vertical "Thread" line for chronological flow
  - [x] Mute visual prominence of the timeline line for professional feel
- [x] **M6.2: Stay Lifecycle Automation**
  - [x] Implement mandatory check-in/out timestamps for Stays
  - [x] Automatically create/update/delete Check-in and Check-out activities linked to Stays
  - [x] Implement backend-enforced Stay Overlap Validation
- [x] **M6.3: Entry & Life-cycle Management**
  - [x] [TDD] Implement adaptive `AddEventDialog` with Type-specific pickers
  - [x] Implement universal, muted "Add Activity" and "Add Stay" buttons for every day
  - [x] Implement Edit and Delete actions with safe confirmation
  - [x] [Refactor] Implement Discriminated Unions for full-stack type safety

## Milestone 7: Spatial Logic & Mapping (DONE)

- [x] **M7.1: Leaflet Engine Integration**
  - [x] Setup high-density, theme-aware map in the inspector panel
  - [x] Implement 1:1 perfectly symmetric dual-pane layout
- [x] **M7.2: Coordinate Resolution**
  - [x] [TDD] Implement Plus Code decoding (Full and Short codes)
  - [x] Add separate fields for Location Name and Plus Code in forms
  - [x] Implement fly-to synchronization on timeline hover
- [x] **M7.3: Route Visualization**
  - [x] Integrate OSRM for automatic driving duration estimates
  - [x] Draw dashed journey paths between markers on the map
  - [x] Implement in-line "🚗 XX min drive" indicators in the timeline

## Milestone 8: Advanced Logic & Polish (CURRENT)

- [ ] **M8.1: Mobile Layout Audit**
  - [ ] Optimize density for small-screen viewports
- [ ] **M8.2: Navigation External Links**
  - [ ] Add "Open in Google Maps" deep-links to itinerary rows
