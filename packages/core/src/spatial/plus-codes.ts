import * as OLC from 'open-location-code';

/**
 * Robust regex to detect a Plus Code pattern within a string.
 */
const PLUS_CODE_REGEX = /([A-Z0-9]{8}\+[A-Z0-9]{2,})|([A-Z0-9]{2,}\+[A-Z0-9]{2,})/;

/**
 * Resolves a location string (potentially containing a Plus Code) into coordinates.
 */
export async function resolveLocation(text: string): Promise<[number, number] | null> {
  const match = text.match(PLUS_CODE_REGEX);
  if (!match) return null;

  const olc = new (OLC as any).OpenLocationCode();
  const code = match[0];

  if (olc.isFull(code)) {
    const res = olc.decode(code);
    return [res.latitudeCenter, res.longitudeCenter];
  }

  const locality = text
    .replace(code, '')
    .trim()
    .replace(/^[,\s]+|[,\s]+$/g, '');
  if (!locality) return null;

  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locality)}&format=json&limit=1`;
    const response = await fetch(searchUrl, {
      headers: { 'User-Agent': 'HopOnTravelPlanner/1.0' },
    });
    const data = await response.json();

    if (data && data.length > 0) {
      const refLat = parseFloat(data[0].lat);
      const refLng = parseFloat(data[0].lon);
      const recoveredFullCode = olc.recoverNearest(code, refLat, refLng);
      const res = olc.decode(recoveredFullCode);
      return [res.latitudeCenter, res.longitudeCenter];
    }
  } catch (error) {
    console.error('[Spatial] Failed to resolve short plus code:', error);
  }

  return null;
}

/**
 * Generates a Google Maps deep-link for an event.
 * Priority: Plus Code > Lat/Lng > Location Name.
 */
export function getGoogleMapsUrl(event: {
  plusCode?: string | null;
  lat?: number | null;
  lng?: number | null;
  locationName?: string | null;
}): string | null {
  const baseUrl = 'https://www.google.com/maps/search/?api=1&query=';

  if (event.plusCode) {
    return `${baseUrl}${encodeURIComponent(event.plusCode)}`;
  }

  if (
    event.lat !== null &&
    event.lng !== null &&
    event.lat !== undefined &&
    event.lng !== undefined
  ) {
    return `${baseUrl}${event.lat},${event.lng}`;
  }

  if (event.locationName) {
    return `${baseUrl}${encodeURIComponent(event.locationName)}`;
  }

  return null;
}
