import { describe, it, expect, vi } from 'vitest';
import { resolveLocation, getGoogleMapsUrl } from './plus-codes';

describe('Universal Location Resolution', () => {
  it('should extract coordinates from a Google Maps URL (@ format)', async () => {
    const url = 'https://www.google.com/maps/place/Oslo/@59.9139,10.7522,13z/...';
    const result = await resolveLocation(url);
    expect(result).toEqual([59.9139, 10.7522]);
  });

  it('should extract coordinates from a Google Maps metadata URL (!3d format)', async () => {
    const url =
      'https://www.google.com/maps/search/Hotel+A/@?api=1&query=Hotel+A&data=!4m2!3m1!1s0x46416e61!3d59.9139!4d10.7522';
    const result = await resolveLocation(url);
    expect(result).toEqual([59.9139, 10.7522]);
  });

  it('should resolve a Full Plus Code directly', async () => {
    const result = await resolveLocation('8FVC9G8F+5W');
    expect(result).toBeDefined();
    expect(result![0]).toBeCloseTo(47.37, 1);
  });

  it('should fallback to text search (Nominatim) for location names', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => [{ lat: '48.8584', lon: '2.2945' }],
    });

    const result = await resolveLocation('Eiffel Tower');
    expect(result).toEqual([48.8584, 2.2945]);
  });
});

describe('Google Maps Deep-Links', () => {
  it('should prioritize Latitude/Longitude for direct placement', () => {
    const url = getGoogleMapsUrl({ lat: 1.23, lng: 4.56, locationName: 'Tokyo' });
    expect(url).toContain('query=1.23,4.56');
  });

  it('should fallback to Name if no coordinates', () => {
    const url = getGoogleMapsUrl({ locationName: 'The Thief Hotel' });
    expect(url).toContain('query=The%20Thief%20Hotel');
  });
});
