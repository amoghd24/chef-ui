import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/use-auth-store';
import { 
  LoginForm, 
  AuthLayout, 
  BrandLogo, 
  AuthCard 
} from '@/components/blocks/auth';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <BrandLogo 
        title="Chef UI" 
        subtitle="Welcome back! Sign in to continue" 
      />
      
      <AuthCard
        title="Sign in"
        description="Enter your username and password to access your account"
      >
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage; 