import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useContext, useState, useEffect, createContext } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import { useRefreshContext } from './RefreshContext';
import { useNavigate } from 'react-router-dom';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { formError, setFormError } = useFormErrorContext();
  // console.log("UserContext1.formError=", formError);
  const refreshContext = useRefreshContext();

  const [userProfile, setUserProfile] = useState(null);
  const { user, refreshToken, setUser, setRefreshToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { 
    fetchUserProfile();
  }, [user, refreshToken]);

  useEffect(() => {
    console.log("UserContext -> Количество запросов в очереди:", 
      refreshContext.requestQueue.length, refreshContext.requestQueue);
  }, [refreshContext.requestQueue]);

  const fetchUserProfile = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8003/api/users/getuser'
      );

      if (response.data !== undefined) {
        console.log("User Profile fetching:", response.data);
        setUserProfile(response.data);
      } else {
        console.log("User Profile fetching:", null);
        setUserProfile(null);
      }
      console.log("User Profile", userProfile);

    } catch (error) {
      console.error('Error fetching User Profile:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("UserContext2.formError=", formError);
      }
    }
  };

  const updateProfile = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        'http://localhost:8003/api/users/profile',
        payload
      );
      console.log('Profile saved:', response.data);
      alert(response.data.message); // Display the response message

      // Sending a request to refresh tokens
      const refreshResponse = await axios.post(
        "http://localhost:8003/api/auth/refreshtoken",
        {
          email: user?.sub,
          tokenUUID: refreshToken?.UUID
        },
        {
          headers: {
            "Refresh-Token": `Bearer ${refreshToken}`,
          },
        }
      );
      console.log("refreshResponse:", refreshResponse.data);

      // Refreshing tokens in localStorage and in the application
      localStorage.setItem("tokens", JSON.stringify(refreshResponse.data));
      setUser(jwt_decode(refreshResponse.data.access_token));
      setRefreshToken(jwt_decode(refreshResponse.data.refresh_token));
      navigate("/");

    } catch (error) {
      console.error("Error saving User Profile:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("UserContext3.formError=", formError);
      } 
    }
  };

  const updatePassword = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8003/api/users/password",
        payload
      );
      console.log("Password updated:", response.data);
      alert(response.data.message); // Display the response messagee
      navigate("/");

    } catch (error) {
      console.error("Error updating User Password:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("UserContext4.formError=", formError);
      }
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, formError, setFormError, 
      fetchUserProfile, updateProfile, updatePassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);