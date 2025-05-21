import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function AuthCard({ 
  title, 
  description, 
  children, 
  className,
  footer
}: AuthCardProps) {
  return (
    <div className={cn(
      "bg-card text-card-foreground rounded-lg shadow-sm p-6 border border-border",
      className
    )}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        
        <div className="space-y-4">
          {children}
        </div>
        
        {footer && (
          <div className="mt-6 pt-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
} 