import { describe, it, expect, vi } from 'vitest';
import { resolveLocation, getGoogleMapsUrl } from './plus-codes';

describe('Spatial Resolution (Plus Codes)', () => {
  it('should resolve a FULL plus code directly', async () => {
    const result = await resolveLocation('8FVC9G8F+5W');
    expect(result).toBeDefined();
    expect(result![0]).toBeCloseTo(47.37, 1);
  });

  it('should resolve a SHORT plus code with locality via mock geocoding', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => [{ lat: '62.3364', lon: '11.1685' }],
    });

    const result = await resolveLocation('FM5C+X5 Marstein, Norway');
    expect(result).toBeDefined();
    expect(result![0]).toBeCloseTo(62.33, 0);
  });
});

describe('Google Maps Deep-Links', () => {
  it('should prioritize Plus Code', () => {
    const url = getGoogleMapsUrl({ plusCode: 'ABC', lat: 1, lng: 1, locationName: 'Name' });
    expect(url).toContain('query=ABC');
  });

  it('should fallback to Coordinates if no Plus Code', () => {
    const url = getGoogleMapsUrl({ lat: 1.23, lng: 4.56, locationName: 'Name' });
    expect(url).toContain('query=1.23,4.56');
  });

  it('should fallback to Name if no technical data', () => {
    const url = getGoogleMapsUrl({ locationName: 'Tokyo Tower' });
    expect(url).toContain('query=Tokyo%20Tower');
  });
});
