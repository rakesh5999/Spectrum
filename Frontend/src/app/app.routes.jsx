import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import Dashboard from "../features/products/pages/Dashboard.jsx";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <div>Home</div>
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/seller",
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "create-product",
        element: <CreateProduct />
      }
    ]
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/products/create",
    element: <CreateProduct />
  },
  {
    path: "/create-product",
    element: <CreateProduct />
  }
]);