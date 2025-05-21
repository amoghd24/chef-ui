import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import MenuPlannerPage from "@/pages/menu-planner";
import PredictionDetailsPage from "@/pages/prediction-details";
import { useAuthStore } from "@/store/use-auth-store";

// Auth protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Create routes configuration
const routes = [
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  {
    path: "/menu-planner",
    element: <ProtectedRoute><MenuPlannerPage /></ProtectedRoute>,
  },
  {
    path: "/predictions/:id",
    element: <ProtectedRoute><PredictionDetailsPage /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <div className="p-10 text-center">Page not found</div>,
  },
];

// Create router instance
const router = createBrowserRouter(routes);

// AppRouter component to provide the router context
export function AppRouter() {
  return <RouterProvider router={router} />;
} 