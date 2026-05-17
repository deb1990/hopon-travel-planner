/**
 * Robust regex to detect Google Maps coordinate patterns:
 * 1. @lat,lng (e.g. /@59.913,10.752,15z)
 * 2. !3d!4d metadata (e.g. !3d59.913!4d10.752)
 */
const GOOGLE_COORD_REGEX = /@(-?\d+\.\d+),(-?\d+\.\d+)|!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;

/**
 * Resolves a location URL into precise coordinates.
 * Strictly limited to URL extraction as per system mandate.
 */
export async function resolveLocation(text: string): Promise<[number, number] | null> {
  if (!text) return null;

  // 1. Google Maps URL Coordinate Extraction
  const urlMatch = text.match(GOOGLE_COORD_REGEX);
  if (urlMatch) {
    const lat = parseFloat(urlMatch[1] || urlMatch[3] || '');
    const lng = parseFloat(urlMatch[2] || urlMatch[4] || '');
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  return null;
}

/**
 * Generates a Google Maps deep-link.
 */
export function getGoogleMapsUrl(event: {
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

  if (event.locationName) {
    return `${baseUrl}${encodeURIComponent(event.locationName)}`;
  }

  return null;
}
