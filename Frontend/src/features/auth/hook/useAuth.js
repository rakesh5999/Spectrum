import { setError, setUser, setLoading } from "../state/auth.slice";
import { registerUser ,login } from "../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {

  const dispatch = useDispatch();

  async function handleRegister({ email, contact, fullname, password, isSeller = false }) {

    const data = await registerUser({ email, contact, fullname, password, isSeller });

    dispatch(setUser(data.user));

    return data.user;
  }

  async function handleLogin ({ email, password }) {

    const data = await login ({ email, password });

    dispatch(setUser(data.user));
    
    return data.user;
  }






  return { handleRegister, handleLogin }

}