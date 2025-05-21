import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

          {/* Tools section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Available Tools</h3>
            <div className="bg-background p-4 rounded-md border border-border">
              <Link to="/menu-planner" className="text-primary hover:underline font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
                Menu Quantity Planner
              </Link>
              <p className="text-sm text-muted-foreground mt-1 ml-7">Plan dish quantities based on menu and party size</p>
            </div>
          </div>

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