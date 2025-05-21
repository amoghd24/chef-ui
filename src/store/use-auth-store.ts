import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the type for the auth state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// User type
interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      
      // Login function - in a real app, this would call an API
      login: async (username: string, password: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, hard-coded validation
          // In a real app, this would validate against an API
          if (username === 'demo' && password === 'password') {
            const user = {
              id: '1',
              name: 'Demo User',
              username: 'demo',
              role: 'user',
            };
            
            set({ 
              isAuthenticated: true, 
              user, 
              token: 'demo-token-12345' 
            });
            
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      
      // Logout function
      logout: () => {
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