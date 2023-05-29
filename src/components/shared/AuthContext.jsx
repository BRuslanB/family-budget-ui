import axios from "axios";
import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
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
    const apiResponse = await axios.post(
      "http://localhost:8003/api/auth/signin",
      payload
    );
    localStorage.setItem("tokens", JSON.stringify(apiResponse.data));
    setUser(jwt_decode(apiResponse.data.access_token));
    setRefreshToken(jwt_decode(apiResponse.data.refresh_token));
    navigate("/");
  };
  
  const register = async (payload) => {
    const apiResponse = await axios.post(
      "http://localhost:8003/api/auth/signup",
      payload
    );
    navigate("/");
  };

  const logout = async () => {
    const apiResponse = await axios.post(
      "http://localhost:8003/api/auth/signout"
    );
    localStorage.removeItem("tokens");
    setUser(null);
    setRefreshToken(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, refreshToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;