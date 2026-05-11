import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './reset.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// Layout & Common
import MainLayout from './common/components/MainLayout';
import NotFound from './common/components/NotFound';

// Auth Module
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';

// Dashboard Module
import DashboardPage from './modules/dashboard/pages/DashboardPage';

// Customer Module
import CustomersPage from './modules/customers/pages/CustomersPage';

// Order Module
import NewOrderPage from './modules/orders/pages/NewOrderPage';
import OrderTrackPage from './modules/orders/pages/OrderTrackPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "customers",
        element: <CustomersPage />,
      },
      {
        path: "new_order",
        element: <NewOrderPage />,
      },
      {
        path: "orders",
        element: <OrderTrackPage />,
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
