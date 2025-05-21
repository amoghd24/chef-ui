import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import LoginPage from "@/pages/login";

// Create routes configuration
const routes = [
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <div className="p-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-xl mb-6">Welcome to your dashboard</p>
        </div>,
      },
      // Add more routes here as needed
      {
        path: "*",
        element: <div className="p-10 text-center">Page not found</div>,
      },
    ],
  },
];

// Create router instance
const router = createBrowserRouter(routes);

// AppRouter component to provide the router context
export function AppRouter() {
  return <RouterProvider router={router} />;
} 