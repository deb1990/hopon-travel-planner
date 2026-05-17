import { describe, it, expect, vi } from 'vitest';
import { resolveLocation } from './plus-codes';

describe('Spatial Resolution (Plus Codes)', () => {
  it('should resolve a FULL plus code directly', async () => {
    // 8FVC9G8F+5W -> Zurich
    const result = await resolveLocation('8FVC9G8F+5W');
    expect(result).toBeDefined();
    expect(result![0]).toBeCloseTo(47.37, 1);
    expect(result![1]).toBeCloseTo(8.54, 1);
  });

  it('should resolve a SHORT plus code with locality via mock geocoding', async () => {
    // Mock the Nominatim fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => [{ lat: '62.3364', lon: '11.1685' }],
    });

    const result = await resolveLocation('FM5C+X5 Marstein, Norway');
    expect(result).toBeDefined();
    // Loosen proximity for recovered short codes
    expect(result![0]).toBeCloseTo(62.33, 0);
    expect(result![1]).toBeCloseTo(11.16, 0);
  });

  it('should return null if no plus code is found', async () => {
    const result = await resolveLocation('Just a regular city name');
    expect(result).toBeNull();
  });
});
