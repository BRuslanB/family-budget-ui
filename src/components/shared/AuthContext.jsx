import axios from "axios";
import jwt_decode from "jwt-decode";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormErrorContext } from './FormErrorContext';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

  const { formError, setFormError } = useFormErrorContext();

  const [user, setUser] = useState(() => {
    if (localStorage.getItem("tokens")) {
      let tokens = JSON.parse(localStorage.getItem("tokens"));
      try {
        return jwt_decode(tokens.access_token);
      } catch(error) {
        return null;
      }
    }
    return null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    if (localStorage.getItem("tokens")) {
      let tokens = JSON.parse(localStorage.getItem("tokens"));
      try {
        return jwt_decode(tokens.refresh_token);
      } catch(error) {
        return null;
      }
    }
    return null;
  });

  const navigate = useNavigate();

  const login = async (payload) => {
    try {
      const apiResponse = await axios.post(
        "http://localhost:8003/api/auth/signin",
        payload
      );
      console.log("SignIn successfully!");

      localStorage.setItem("tokens", JSON.stringify(apiResponse.data));
      setUser(jwt_decode(apiResponse.data.access_token));
      setRefreshToken(jwt_decode(apiResponse.data.refresh_token));
      navigate("/");

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error SignIn:", error);
        setFormError(error.response.data.message);
      } else if (error.code === "ERR_NETWORK") {
        console.error("Network Error:", error);
        alert("Connection to Server lost.\nPlease contact technical support.");
        logout();
      }
    }
  };

  const register = async (payload) => {
    try {
      const apiResponse = await axios.post(
        "http://localhost:8003/api/auth/signup",
        payload
      );
      console.log("SignUp successfully!");

      alert(apiResponse.data.message); // Display the response messagee
      navigate("/");
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error SignUp:", error);
        setFormError(error.response.data.message);
      } else if (error.code === "ERR_NETWORK") {
        console.error("Network Error:", error);
        alert("Connection to Server lost.\nPlease contact technical support.");
        logout();
      }
    }
  };

  const logout = async () => {
    try {
      const apiResponse = await axios.post(
        "http://localhost:8003/api/auth/signout"
      );
      console.log("SignOut successfully!");

    } catch (error) {
      console.error("Error SignOut:", error);
    }
    localStorage.removeItem("tokens");
    setUser(null);
    setRefreshToken(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, refreshToken, 
      setUser, setRefreshToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;