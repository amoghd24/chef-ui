import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/use-auth-store';
import { Link } from 'react-router-dom';
import { MenuService, Menu, QuantityPrediction, PartyOrderRequest } from '@/services/menu-service';

// Define the paginated response interface
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const MenuPlannerPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [partySize, setPartySize] = useState<number | undefined>();
  const [predictions, setPredictions] = useState<QuantityPrediction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch menus
  const { data: menusData, isLoading: isLoadingMenus, error: menuError } = useQuery({
    queryKey: ['menus'],
    queryFn: MenuService.getMenus,
  });

  // Extract menus array from the paginated response or handle both array and paginated formats
  const menus = React.useMemo(() => {
    // Handle different response structures safely
    if (!menusData) {
      return [] as Menu[];
    }
    
    // If it's an object with results property (paginated response)
    if (typeof menusData === 'object' && menusData !== null && 'results' in menusData && Array.isArray(menusData.results)) {
      return menusData.results as Menu[];
    }
    
    // If it's directly an array
    if (Array.isArray(menusData)) {
      return menusData as Menu[];
    }
    
    // Default case
    return [] as Menu[];
  }, [menusData]);

  // Create party order mutation
  const createPartyOrder = useMutation({
    mutationFn: MenuService.createPartyOrder,
    onSuccess: async (data) => {
      try {
        // Use the returned ID to predict quantities
        const predictedQuantities = await MenuService.predictQuantities(data.id);
        setPredictions(predictedQuantities);
        setIsLoading(false);
        toast.success('Quantities predicted successfully');
      } catch (error) {
        setError('Failed to predict quantities');
        toast.error('Failed to predict quantities');
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Error creating party order:', error);
      setError('Failed to create party order');
      toast.error('Failed to create party order');
      setIsLoading(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPredictions(null);

    // Basic validation
    if (!selectedMenu) {
      setError('Please select a menu');
      return;
    }

    if (!partySize || partySize <= 0) {
      setError('Please enter a valid party size');
      return;
    }

    // Validate user ID exists
    if (!user?.id) {
      setError('User information is not available. Please log in again.');
      toast.error('Authentication error. Please log in again.');
      return;
    }

    setIsLoading(true);
    
    // Create party order with user_id included
    const orderRequest: PartyOrderRequest = {
      menu_id: selectedMenu,
      party_size: partySize,
      user_id: user.id
    };
    
    createPartyOrder.mutate(orderRequest);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span className="text-sm font-medium">Back</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Menu Quantity Planner</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user?.name || user?.username}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Quantity Predictions</h2>
          <p className="text-muted-foreground mb-6">
            Select a menu and enter party size to get dish quantity predictions.
          </p>

          {/* Form section */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="menu" className="text-sm font-medium">
                Menu Type
              </label>
              <select
                id="menu"
                value={selectedMenu || ''}
                onChange={(e) => setSelectedMenu(Number(e.target.value))}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                disabled={isLoading || isLoadingMenus}
              >
                <option value="">Select a menu</option>
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
              {menuError && <p className="text-sm text-destructive">Failed to load menus</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="partySize" className="text-sm font-medium">
                Party Size
              </label>
              <input
                id="partySize"
                type="number"
                min="1"
                value={partySize || ''}
                onChange={(e) => setPartySize(Number(e.target.value))}
                placeholder="Enter party size"
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full md:w-auto py-2 px-6 bg-primary text-primary-foreground rounded-md font-medium transition-colors ${
                isLoading ? "opacity-70 cursor-wait" : "hover:bg-primary/90"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </form>

          {/* Results section */}
          {predictions && predictions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Predicted Quantities</h3>
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold">Dish Name</th>
                      <th className="text-right p-3 text-sm font-semibold">Predicted Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {predictions.map((prediction) => (
                      <tr key={prediction.dish_id}>
                        <td className="p-3">{prediction.dish_name}</td>
                        <td className="p-3 text-right font-medium">
                          {prediction.predicted_quantity}
                          {prediction.unit ? ` ${prediction.unit}` : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {predictions && predictions.length === 0 && (
            <div className="text-center p-8 border border-border rounded-md">
              <p className="text-muted-foreground">No predictions available for this menu and party size.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MenuPlannerPage; 