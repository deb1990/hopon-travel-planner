CREATE TYPE "public"."accommodation_type" AS ENUM('Hotel', 'AirBNB', 'Camping', 'Other');--> statement-breakpoint
ALTER TABLE "itinerary_events" ADD COLUMN "accommodation_type" "accommodation_type";