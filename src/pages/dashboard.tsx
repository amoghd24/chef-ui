import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/use-auth-store';
import { MenuService, PastPrediction } from '@/services/menu-service';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  // Fetch past predictions
  const { 
    data: pastPredictions, 
    isLoading: isLoadingPredictions, 
    error: predictionsError,
    refetch: refetchPredictions
  } = useQuery({
    queryKey: ['pastPredictions', user?.id],
    queryFn: () => MenuService.getPastPredictions(user?.id),
    // Only fetch when user is available
    enabled: !!user?.id
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
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
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground mb-6">
            You've successfully logged in to the Chef UI platform. Use the tools below to manage your menus and predictions.
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
        </div>

        {/* Past Predictions Section */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Past Quantity Predictions</h3>
            <button 
              onClick={() => refetchPredictions()} 
              className="text-sm text-primary hover:text-primary/80 flex items-center"
              disabled={isLoadingPredictions}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`mr-1 ${isLoadingPredictions ? 'animate-spin' : ''}`}
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                <path d="M16 21h5v-5"></path>
              </svg>
              {isLoadingPredictions ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {predictionsError ? (
            <div className="text-center p-8 border border-destructive/20 bg-destructive/10 rounded-md">
              <p className="text-destructive">Failed to load predictions. Please try again.</p>
            </div>
          ) : isLoadingPredictions ? (
            <div className="text-center p-8 border border-border rounded-md">
              <p className="text-muted-foreground">Loading predictions...</p>
            </div>
          ) : pastPredictions && pastPredictions.length > 0 ? (
            <div className="border border-border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">Name</th>
                    <th className="text-left p-3 text-sm font-semibold">Menu</th>
                    <th className="text-center p-3 text-sm font-semibold">Party Size</th>
                    <th className="text-left p-3 text-sm font-semibold">Created</th>
                    <th className="text-right p-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pastPredictions.map((prediction) => (
                    <tr key={prediction.id} className="hover:bg-muted/50">
                      <td className="p-3">{prediction.name}</td>
                      <td className="p-3">{prediction.party_order.menu.name}</td>
                      <td className="p-3 text-center">{prediction.party_order.party_size}</td>
                      <td className="p-3">{formatDate(prediction.created_at)}</td>
                      <td className="p-3 text-right">
                        <Link 
                          to={`/menu-planner?predictionId=${prediction.id}`}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8 border border-border rounded-md">
              <p className="text-muted-foreground">No predictions available yet.</p>
              <Link 
                to="/menu-planner" 
                className="mt-4 inline-block text-primary hover:text-primary/80 font-medium"
              >
                Create your first prediction
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 