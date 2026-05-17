CREATE TYPE "public"."transit_mode" AS ENUM('Flight', 'Drive', 'Walk', 'Boat', 'Train', 'Bus');--> statement-breakpoint
ALTER TABLE "itinerary_events" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."event_type";--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('STAY', 'ACTIVITY', 'TRANSIT', 'CHECK_IN', 'CHECK_OUT');--> statement-breakpoint
ALTER TABLE "itinerary_events" ALTER COLUMN "type" SET DATA TYPE "public"."event_type" USING "type"::"public"."event_type";--> statement-breakpoint
ALTER TABLE "itinerary_events" ADD COLUMN "transit_mode" "transit_mode";