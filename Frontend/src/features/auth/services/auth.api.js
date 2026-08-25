import axios from "axios";

const authApiInstance = axios.create({
  baseURL : "/api/auth",
  withCredentials: true,
})

export const registerUser =async ({ email, contact, fullname, password , isSeller}) => {

  const response = await authApiInstance.post("/register", {
    email,
    contact,
    fullname,
    password,
    isSeller
  })
  return response.data;
}

export const login = async ({email, password}) => {

  const response = await authApiInstance.post("/login", {
    email,
    password
})

  return response.data;

}
