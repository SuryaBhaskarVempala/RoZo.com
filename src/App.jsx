import React, { useContext, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import NotFound from "./pages/NotFound.jsx";

import Index from "./pages/Index.jsx";
import PlantDetails from "./components/PlantDetails";
import Account from "./components/Account.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { AuthProvider, AuthContext } from "./store/AuthContext.jsx";
import { CartProvider } from './store/CartContext.jsx'
import CheckOut from './components/CheckOut.jsx';

const queryClient = new QueryClient();

const CheckAuth = ({ children }) => {
  const { user, setUser, logout } = useContext(AuthContext);

  useEffect(() => {
    const checkToken = async () => {
      console.log(localStorage.getItem("token"));
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", res.status);

        if (!res.ok) throw new Error("Invalid token");

        const data = await res.json();
        console.log("User data:", data);
        setUser(data.user);

      } catch (err) {
        console.error("Token invalid or expired");
        logout();
      }
    };

    checkToken();
  }, []);

  return children;
};

const AppContent = () => {
  const { user } = useContext(AuthContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <CheckAuth>
          <Index />
        </CheckAuth>
      ),
    },
    {
      path: "/plantDetails/:id",
      element: (<CheckAuth>
        <PlantDetails />
      </CheckAuth>),
    },
    {
      path: "/Account",
      element: (
        <CheckAuth>
          {user ? <Account /> : <Login />}
        </CheckAuth>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: '/checkout',
      element: (<CheckAuth><CheckOut /></CheckAuth>),
    },
    {
      path:'*',
      element:<NotFound/>
    }
  ]);

  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App; 