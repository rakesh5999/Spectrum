import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import Dashboard from "../features/products/pages/Dashboard.jsx";
import Home from "../features/products/pages/Home.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import ProductDetails from "../features/products/pages/ProductDetails.jsx";
import SellerProductDetails from "../features/products/pages/SellerProductDetails.jsx";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />
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
    path: "/product/:productId",
    element: <ProductDetails />
  },
  {
    path: "/seller",
    children: [
      {
        path: "dashboard",
        element: (
          <Protected role="seller">
            <Dashboard />
          </Protected>
        )
      },
      {
        path: "create-product",
        element: (
          <Protected role="seller">
            <CreateProduct />
          </Protected>
        )
      },
      {
        path: "product/:productId",
        element:<Protected role="seller">
            <SellerProductDetails />
          </Protected>
      }
    ]
  },
  
]);