import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '@/services/auth-service';
import { UserProfile } from '@/types';

// Define the type for the auth state
interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      
      // Login function using the AuthService
      login: async (username: string, password: string) => {
        try {
          // Call the real API through our service
          const response = await AuthService.login({ username, password });
          
          if (response && response.token) {
            set({ 
              isAuthenticated: true, 
              user: response.user || {
                id: '1',
                username,
                name: username,
                role: 'user',
              },
              token: response.token 
            });
            
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      
      // Logout function using the AuthService
      logout: () => {
        // Call the logout method from our service
        AuthService.logout();
        
        set({ 
          isAuthenticated: false, 
          user: null, 
          token: null 
        });
      },
    }),
    {
      name: 'chef-ui-auth', // name of the item in localStorage
      // Only persist these fields
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token 
      }),
    }
  )
); 