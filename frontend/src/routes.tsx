import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/home";
import { LayoutAuth } from "./pages/auth/layout";
import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import { RequireAuth } from "./components/privateRoute";

export const routers = createBrowserRouter([
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        index: true,
        path: '/',
        element: <Home />
      }
    ]
  },
  {
    path: '/auth',
    element: <LayoutAuth />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  }
])