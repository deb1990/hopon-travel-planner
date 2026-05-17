'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from 'next-themes';
import { ItineraryEvent } from '@hopon/core';
import polyline from '@mapbox/polyline';

// Fix for default Leaflet icon missing in build
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  events?: ItineraryEvent[];
  center?: [number, number];
  zoom?: number;
  selectedEventId?: string | null;
}

/**
 * High-density map view for visualizing spatial journey.
 * Features auto-zoom to fit all locations and paths.
 */
export default function MapView({
  events = [],
  center = [59.9139, 10.7522],
  zoom = 13,
  selectedEventId,
}: MapViewProps) {
  const { resolvedTheme } = useTheme();

  const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTiles = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const tileUrl = resolvedTheme === 'dark' ? darkTiles : lightTiles;

  // 1. Filter events with coordinates
  const markers = events.filter(
    (e) => e.lat !== null && e.lng !== null && e.lat !== undefined && e.lng !== undefined,
  );

  // 2. Extract all polylines
  const paths = events
    .filter((e) => e.routePolyline)
    .map((e) => ({
      id: e.id,
      positions: polyline.decode(e.routePolyline!) as [number, number][],
    }));

  // 3. Calculate full trip bounds
  const bounds = L.latLngBounds([]);
  markers.forEach((m) => bounds.extend([m.lat!, m.lng!]));
  paths.forEach((p) => p.positions.forEach((pos) => bounds.extend(pos)));

  // 4. Determine target view
  const activeMarker = markers.find((m) => m.id === selectedEventId);
  const flyToTarget: [number, number] | null = activeMarker
    ? [activeMarker.lat!, activeMarker.lng!]
    : null;

  return (
    <div className="size-full bg-muted/20 relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="size-full z-10"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />

        {paths.map((path) => (
          <Polyline
            key={path.id}
            positions={path.positions}
            pathOptions={{
              color: '#6366f1',
              weight: 3,
              dashArray: '8, 8',
              opacity: 0.6,
            }}
          />
        ))}

        {markers.map((event) => (
          <Marker key={event.id} position={[event.lat!, event.lng!]}>
            <Popup className="technical-popup">
              <div className="p-1">
                <p className="text-[10px] font-black uppercase tracking-tighter italic text-primary leading-none mb-1">
                  {event.type}
                </p>
                <p className="text-sm font-bold text-foreground leading-tight">{event.title}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase">
                  {event.locationName}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapController
          flyToTarget={flyToTarget}
          bounds={bounds.isValid() ? bounds : null}
          defaultZoom={zoom}
        />
      </MapContainer>

      <div className="absolute inset-0 pointer-events-none z-20 ring-1 ring-inset ring-border/50 rounded-[2.5rem]" />
    </div>
  );
}

/**
 * Smart controller that fits bounds on load and flies to selections.
 */
function MapController({
  flyToTarget,
  bounds,
  defaultZoom,
}: {
  flyToTarget: [number, number] | null;
  bounds: L.LatLngBounds | null;
  defaultZoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (flyToTarget) {
      map.flyTo(flyToTarget, 15, { animate: true, duration: 1.2 });
    } else if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [flyToTarget, bounds, map, defaultZoom]);

  return null;
}
