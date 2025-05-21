import { api } from "@/utils";

// Types
export interface Menu {
  id: number;
  name: string;
  [key: string]: any; // Additional fields returned by the API
}

export interface PartyOrderRequest {
  menu_id: number;
  party_size: number;
  user_id: string | number; // Add user_id field required by the backend
}

export interface PartyOrderResponse {
  id: number;
  menu: Menu;
  party_size: number;
  created_at: string;
  [key: string]: any; // Additional fields
}

export interface PredictionItem {
  item_name: string;
  quantity_value: number;
  unit: string;
}

export interface PredictionCourse {
  course_name: string;
  items: PredictionItem[];
}

export interface PredictionResponse {
  prediction_id: number;
  name: string;
  created_at: string;
  data: {
    predictions: PredictionCourse[];
  }
}

export interface PastPrediction {
  id: number;
  name: string;
  created_at: string;
  party_order: {
    id: number;
    party_size: number;
    created_at: string;
    menu: {
      id: number;
      name: string;
    }
  };
  predictions?: PredictionCourse[];
  [key: string]: any;
}

export interface QuantityPrediction {
  dish_id: string | number; // Allow either string or number
  dish_name: string;
  predicted_quantity: number;
  unit?: string;
  [key: string]: any; // Additional fields
}

export const MenuService = {
  /**
   * Get all available menus
   */
  getMenus: async (): Promise<Menu[]> => {
    try {
      const response = await api.get<Menu[]>("/api/menus/");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch menus", error);
      throw error;
    }
  },

  /**
   * Create a new party order
   */
  createPartyOrder: async (data: PartyOrderRequest): Promise<PartyOrderResponse> => {
    try {
      const response = await api.post<PartyOrderResponse>("/api/party-orders/", data);
      return response.data;
    } catch (error) {
      console.error("Failed to create party order", error);
      throw error;
    }
  },

  /**
   * Predict quantities for a party order
   */
  predictQuantities: async (orderId: number): Promise<QuantityPrediction[]> => {
    try {
      const response = await api.post<PredictionResponse>(`/api/party-orders/${orderId}/predict_quantities/`);
      
      // Transform the response to match our expected format
      const predictions: QuantityPrediction[] = [];
      
      if (response.data && response.data.data && response.data.data.predictions) {
        // Flatten the nested structure into a simple array
        response.data.data.predictions.forEach((course, courseIndex) => {
          course.items.forEach((item, itemIndex) => {
            predictions.push({
              dish_id: `${courseIndex}-${itemIndex}`, // Generate a unique ID
              dish_name: `${course.course_name}: ${item.item_name}`,
              predicted_quantity: item.quantity_value,
              unit: item.unit
            });
          });
        });
      }
      
      return predictions;
    } catch (error) {
      console.error("Failed to predict quantities", error);
      throw error;
    }
  },

  /**
   * Fetch past predictions
   * @param userId Optional user ID to filter results
   */
  getPastPredictions: async (userId?: string | number): Promise<PastPrediction[]> => {
    try {
      // Add user filter if userId is provided
      const endpoint = userId 
        ? `/api/predicted_quantities/?user=${userId}`
        : `/api/predicted_quantities/`;
        
      const response = await api.get<any>(endpoint);
      
      // Check if the response has a 'results' property (pagination)
      if (response.data && 'results' in response.data) {
        return response.data.results;
      }
      
      // Check if it's an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // If it's neither, return an empty array
      return [];
    } catch (error) {
      console.error("Failed to fetch past predictions", error);
      // Return empty array instead of throwing to handle gracefully
      return [];
    }
  },

  /**
   * Get details of a specific prediction
   */
  getPredictionDetails: async (id: number): Promise<PastPrediction> => {
    try {
      const response = await api.get<PastPrediction>(`/api/predicted_quantities/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch prediction details for ID ${id}`, error);
      throw error;
    }
  }
}; 