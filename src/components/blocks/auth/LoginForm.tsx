import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/use-auth-store';
import { cn } from '@/lib/utils';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!username) {
      setError('Please enter your username');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      setIsLoading(true);
      const success = await login(username, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className={cn(
            "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <a 
            href="#" 
            className="text-sm text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              // Handle forgot password
            }}
          >
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className={cn(
            "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 text-primary border-border rounded focus:ring focus:ring-ring"
        />
        <label htmlFor="remember-me" className="ml-2 text-sm">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        className={cn(
          "w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium transition-colors",
          isLoading ? "opacity-70 cursor-wait" : "hover:bg-primary/90"
        )}
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      <div className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <a 
          href="#" 
          className="text-primary hover:underline"
          onClick={(e) => {
            e.preventDefault();
            navigate('/register');
          }}
        >
          Sign up
        </a>
      </div>
    </form>
  );
} 