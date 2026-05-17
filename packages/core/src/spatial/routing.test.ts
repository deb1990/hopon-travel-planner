import { describe, it, expect, vi } from 'vitest';
import { getRouteEstimate } from './routing';

describe('Spatial Routing (OSRM)', () => {
  it('should fetch and parse a route estimate correctly', async () => {
    // Mock OSRM response
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        code: 'Ok',
        routes: [
          {
            duration: 3600, // 60 minutes
            distance: 50000, // 50 km
            geometry: 'abc_polyline',
          },
        ],
      }),
    });

    const result = await getRouteEstimate([60, 10], [61, 11]);

    expect(result).toBeDefined();
    expect(result!.durationMinutes).toBe(60);
    expect(result!.distanceKm).toBe(50);
    expect(result!.geometry).toBe('abc_polyline');
  });

  it('should return null on OSRM error code', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ code: 'NoRoute' }),
    });

    const result = await getRouteEstimate([0, 0], [1, 1]);
    expect(result).toBeNull();
  });
});
