import { AxiosError } from "axios";
import { api } from "@/utils";
import { AuthResponse, LoginCredentials, UserProfile } from "@/types";

// Auth endpoint from API documentation
const AUTH_ENDPOINT = "/api-token-auth/";

export const AuthService = {
  /**
   * Login with username and password
   * Makes POST request to /api-token-auth/ endpoint
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Ensure username is lowercase for consistency
      const username = credentials.username.toLowerCase();
      const { password } = credentials;
      
      console.log(`Attempting login to: ${AUTH_ENDPOINT}`);
      
      // Make POST request to auth endpoint
      const response = await api.post<AuthResponse>(AUTH_ENDPOINT, {
        username,
        password,
      });
      
      console.log('Login response status:', response.status);
      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      if (error instanceof AxiosError && error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Failed to login. Please try again.");
    }
  },

  /**
   * Get the current user's profile
   */
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      // This endpoint may need to be adjusted based on your API
      const response = await api.get<UserProfile>("auth/profile/");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      throw error;
    }
  },

  /**
   * Log the user out (clears local storage)
   */
  logout: () => {
    // Clear auth data from localStorage
    localStorage.removeItem('chef-ui-auth');
    // No need for API call since we're using token-based auth
    // If your backend requires logout notification, uncomment:
    // return api.post("auth/logout/");
  },
}; 