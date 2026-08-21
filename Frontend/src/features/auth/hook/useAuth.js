import { setError,setUser,setLoading } from "../state/auth.slice";
import { registerUser } from "../services/auth.api";
import {useDispatch} from "react-redux";

export const useAuth = () =>{

  const dispatch = useDispatch();

   async function handleRegister({email, contact, fullname, password, isSeller = false}) {
  
    const data = await registerUser({email, contact, fullname, password, isSeller});

    dispatch(setUser(data.user));

   }

   return { handleRegister}

}