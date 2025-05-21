import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={cn(isDarkMode ? 'dark' : '')}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="p-4 border-b border-border">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Chef UI</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </header>
        
        <main className="container mx-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 