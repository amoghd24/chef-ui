import { cn } from '@/lib/utils';

interface BrandLogoProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function BrandLogo({ title, subtitle, className }: BrandLogoProps) {
  return (
    <div className={cn("text-center mb-8", className)}>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <span className="text-2xl text-primary-foreground font-bold">
            {title.charAt(0)}
          </span>
        </div>
      </div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
} 