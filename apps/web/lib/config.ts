/**
 * Global configuration for the Web application.
 * Centralizes environment variables and development constants.
 */
export const CONFIG = {
  /**
   * Base URL for the backend API service.
   */
  API_URL: process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4001',

  /**
   * Mock user ID for local development and demonstration.
   */
  DEMO_USER_ID: 'b07bb29b-67de-4f35-8c85-111c8358436b',
} as const;
