import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/use-auth-store';
import { MenuService, PastPrediction, PredictionCourse } from '@/services/menu-service';

const PredictionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Fetch prediction details
  const { 
    data: prediction, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['prediction', id],
    queryFn: () => MenuService.getPredictionDetails(parseInt(id || '0', 10)),
    enabled: !!id, // Only fetch when ID is available
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
          </div>
          <div className="text-sm text-muted-foreground">
            Welcome, <span className="font-medium text-foreground">{user?.name || user?.username}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 text-center">
            <p className="text-muted-foreground">Loading prediction details...</p>
          </div>
        ) : error ? (
          <div className="bg-card rounded-lg border border-destructive/20 bg-destructive/10 shadow-sm p-6 text-center">
            <p className="text-destructive">Failed to load prediction details. Please try again.</p>
            <button 
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium transition-colors hover:bg-primary/90"
            >
              Return to Dashboard
            </button>
          </div>
        ) : prediction ? (
          <div className="space-y-6">
            {/* Prediction Header Info */}
            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{prediction.name}</h1>
                  <p className="text-muted-foreground">
                    Created on {formatDate(prediction.created_at)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="bg-primary/10 px-4 py-2 rounded-md">
                    <p className="text-sm text-muted-foreground">Menu</p>
                    <p className="font-medium">{prediction.party_order.menu.name}</p>
                  </div>
                  <div className="bg-primary/10 px-4 py-2 rounded-md">
                    <p className="text-sm text-muted-foreground">Party Size</p>
                    <p className="font-medium">{prediction.party_order.party_size} people</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictions Table */}
            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Predicted Quantities</h2>
              
              {/* Check different potential formats of the prediction data */}
              {prediction.predictions && prediction.predictions.length > 0 ? (
                <div className="space-y-6">
                  {prediction.predictions.map((course: PredictionCourse, courseIndex: number) => (
                    <div key={courseIndex} className="space-y-3">
                      <h3 className="text-lg font-medium">{course.course_name}</h3>
                      <div className="border border-border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-3 text-sm font-semibold">Item</th>
                              <th className="text-right p-3 text-sm font-semibold">Quantity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {course.items.map((item, itemIndex) => (
                              <tr key={itemIndex} className="hover:bg-muted/50">
                                <td className="p-3">{item.item_name}</td>
                                <td className="p-3 text-right font-medium">
                                  {item.quantity_value} {item.unit}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : prediction.data && prediction.data.predictions ? (
                // Alternative format from API
                <div className="space-y-6">
                  {prediction.data.predictions.map((course: PredictionCourse, courseIndex: number) => (
                    <div key={courseIndex} className="space-y-3">
                      <h3 className="text-lg font-medium">{course.course_name}</h3>
                      <div className="border border-border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-3 text-sm font-semibold">Item</th>
                              <th className="text-right p-3 text-sm font-semibold">Quantity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {course.items.map((item, itemIndex) => (
                              <tr key={itemIndex} className="hover:bg-muted/50">
                                <td className="p-3">{item.item_name}</td>
                                <td className="p-3 text-right font-medium">
                                  {item.quantity_value} {item.unit}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border border-border rounded-md">
                  <p className="text-muted-foreground">No prediction data available.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 text-center">
            <p className="text-muted-foreground">Prediction not found.</p>
            <button 
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium transition-colors hover:bg-primary/90"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PredictionDetailsPage; 