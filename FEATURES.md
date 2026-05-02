# Hop On: Functional Specification

A high-density, professional travel itinerary planner designed for complex, multi-stop journeys. The system prioritizes spatial-temporal logic (where you are and when) over simple list-making.

## 1. Core Planning Concept: "Base-Centric" Logic

Unlike traditional planners that are just lists of dates, this system revolves around **Bases** (Stays/Accommodation).

- **Base Groups:** All itinerary items are visually and logically grouped under the "Base" where the user is staying during those dates.
- **Gap Detection:** The system automatically identifies "Missing Base" gaps. If dates exist without an assigned accommodation, they are marked with high-visibility amber alerts ("No Base assigned") to prevent planning oversights.
- **Date Shifting:** Moving a "Base Group" (e.g., swapping your 3 days in Tokyo with your 3 days in Osaka) automatically shifts all associated activities and travel segments to the new corresponding dates.

## 2. Smart Itinerary Management

- **Automated Logistics:**
  - Adding a "Base" automatically generates locked **Check-in** and **Check-out** activities.
  - **Checkout Logic:** The system understands hotel logic; "Check-out" is automatically placed on the morning _after_ the final night of the stay, ensuring the departure day is correctly initialized.
- **Nested Reordering:**
  - **Activity Level:** Users can drag-and-drop to reorder activities within a specific day.
  - **Group Level:** Users can drag-and-drop entire Base Groups to rearrange the sequence of a multi-city trip.
- **System Safeguards:**
  - Critical items (Check-in/Check-out) are protected from accidental deletion.
  - Protected items display a disabled delete icon with a tooltip explanation rather than being hidden, maintaining UI consistency.
- **High-Density Interface:**
  - Ultra-compact rows designed to show maximum information (Time, Location, Booking Links, Distance, Logistics) in minimal screen real estate.

## 3. Travel & Logistics

- **Linked Travel Segments:** Travel (Flights, Trains, etc.) is rendered as two connected context rows:
  - **Departure Row:** Origin details and departure time.
  - **Arrival Row:** Destination details and arrival time.
- **Metadata Support:** Every item supports deep-linking for bookings, travel numbers (e.g., Flight BA123), and specific accommodation types (Hotel, Airbnb, Camping, etc.).
- **Temporal Flow:** Items are sorted chronologically by time, with distances from previous locations automatically calculated to help visualize transit times.

## 4. Integrated Mapping & Navigation

- **Chronological Pathing:** The map draws a visual "thread" connecting all activities and travel points in the order they occur.
- **Spatial Sync:**
  - Hovering over an itinerary item highlights and scales the corresponding map marker.
  - Clicking a map marker scrolls the itinerary to that specific event.
- **Direct Navigation:** Every item includes a "one-click" navigation action that opens native GPS directions to that specific coordinate.
- **Environment Aware:** The map automatically switches between light and dark modes to match the user's system preference.

## 5. Dashboard & Organization

- **Multi-Trip Management:** A central dashboard to create, name, and manage various trip drafts.
- **Cloud Sync:** Plans are tied to a user account, ensuring the itinerary is accessible and identical across mobile and desktop devices.
- **Privacy First:** Itineraries are private by default; users only have access to their own created content.
- **Modern Aesthetics:** A professional "Slate & Indigo" theme focused on depth and clarity.
