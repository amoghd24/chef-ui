import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background p-4", className)}>
      <div className="w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  );
} 