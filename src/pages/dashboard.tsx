import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/use-auth-store';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Chef UI Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user?.name || user?.username}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground mb-6">
            You've successfully logged in to the Chef UI platform. This is a placeholder dashboard page.
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {['Menus', 'Dishes', 'Orders'].map((item, index) => (
              <div key={index} className="bg-background p-4 rounded-md border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total {item}</p>
                <p className="text-2xl font-bold">{(index + 1) * 12}</p>
              </div>
            ))}
          </div>

          {/* Recent activity section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
            <div className="border border-border rounded-md divide-y divide-border">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Activity {item}</p>
                    <p className="text-sm text-muted-foreground">Sample description for activity {item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 