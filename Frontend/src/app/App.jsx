import React from 'react'
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { routes } from "./app.routes.jsx";
import { store } from "./app.store.js";

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  );
};

export default App;

