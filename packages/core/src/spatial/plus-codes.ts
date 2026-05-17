import * as OLC from 'open-location-code';

/**
 * Robust regex to detect Google Maps coordinate patterns:
 * 1. @lat,lng (e.g. /@59.913,10.752,15z)
 * 2. !3d!4d metadata (e.g. !3d59.913!4d10.752)
 */
const GOOGLE_COORD_REGEX = /@(-?\d+\.\d+),(-?\d+\.\d+)|!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
const PLUS_CODE_REGEX = /([A-Z0-9]{8}\+[A-Z0-9]{2,})|([A-Z0-9]{2,}\+[A-Z0-9]{2,})/;

/**
 * Resolves a location string (URL, Plus Code, or Name) into coordinates.
 */
export async function resolveLocation(text: string): Promise<[number, number] | null> {
  if (!text) return null;

  // 1. HIGHEST PRIORITY: Google Maps URL Coordinate Extraction
  const urlMatch = text.match(GOOGLE_COORD_REGEX);
  if (urlMatch) {
    const lat = parseFloat(urlMatch[1] || urlMatch[3] || '');
    const lng = parseFloat(urlMatch[2] || urlMatch[4] || '');
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // 2. SECOND PRIORITY: Plus Code Decoding
  const plusMatch = text.match(PLUS_CODE_REGEX);
  if (plusMatch) {
    const olc = new (OLC as any).OpenLocationCode();
    const code = plusMatch[0];
    if (olc.isFull(code)) {
      const res = olc.decode(code);
      return [res.latitudeCenter, res.longitudeCenter];
    }
    // Short code resolution requires Nominatim reference (Legacy support)
  }

  // 3. FALLBACK: Text-based Geocoding (OSM Nominatim)
  // We treat the whole string as a query if no technical markers found
  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=1`;
    const response = await fetch(searchUrl, {
      headers: { 'User-Agent': 'HopOnTravelPlanner/1.0' },
    });
    const data = await response.json();

    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (error) {
    console.error('[Spatial] Global resolution failed:', error);
  }

  return null;
}

/**
 * Generates a Google Maps deep-link.
 */
export function getGoogleMapsUrl(event: {
  plusCode?: string | null;
  lat?: number | null;
  lng?: number | null;
  locationName?: string | null;
}): string | null {
  const baseUrl = 'https://www.google.com/maps/search/?api=1&query=';

  if (
    event.lat !== null &&
    event.lng !== null &&
    event.lat !== undefined &&
    event.lng !== undefined
  ) {
    return `${baseUrl}${event.lat},${event.lng}`;
  }

  if (event.plusCode) {
    return `${baseUrl}${encodeURIComponent(event.plusCode)}`;
  }

  if (event.locationName) {
    return `${baseUrl}${encodeURIComponent(event.locationName)}`;
  }

  return null;
}
