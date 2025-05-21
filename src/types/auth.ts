/**
 * Authentication related type definitions
 */

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  token: string;
  user?: UserProfile;
} 