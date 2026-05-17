/**
 * Open Source Routing Machine (OSRM) integration for travel estimates.
 */

export interface RouteEstimate {
  durationMinutes: number;
  distanceKm: number;
  geometry: string; // Polyline format
}

/**
 * Fetches a driving route estimate between two points.
 */
export async function getRouteEstimate(
  start: [number, number],
  end: [number, number],
): Promise<RouteEstimate | null> {
  const [startLat, startLng] = start;
  const [endLat, endLng] = end;

  // OSRM expects [lng,lat] format
  const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=simplified&geometries=polyline`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'HopOnTravelPlanner/1.0' },
    });
    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        durationMinutes: Math.round(route.duration / 60),
        distanceKm: parseFloat((route.distance / 1000).toFixed(1)),
        geometry: route.geometry,
      };
    }
  } catch (error) {
    console.error('[Spatial] OSRM Route fetch failed:', error);
  }

  return null;
}
