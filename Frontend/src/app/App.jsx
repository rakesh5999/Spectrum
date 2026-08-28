import React, {useEffect} from 'react'
import { RouterProvider } from "react-router";
import { Provider,useSelector } from "react-redux";
import { routes } from "./app.routes.jsx";
import { store } from "./app.store.js";
import { useAuth } from '../features/auth/hook/useAuth.js';

const App = () => {

  const {handleGetMe} = useAuth()
  const user = useSelector(state => state.auth.user)

  

  useEffect(() => {
    handleGetMe()
  }, [])
  
  return (
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  );
};

export default App;

