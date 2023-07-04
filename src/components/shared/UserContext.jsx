import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useContext, useState, useEffect, createContext } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import { useNavigate } from 'react-router-dom';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {

  const { formError, setFormError } = useFormErrorContext();

  const [userProfile, setUserProfile] = useState(null);
  const { user, refreshToken, setUser, setRefreshToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // useEffect(() => { 
  //   // console.log("UserContext.user", user)
  //   // console.log("UserContext.refreshToken", refreshToken)
  // }, [user, refreshToken]);

  const fetchUserProfile = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
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
      if (error.response && error.response.status === 400) {
        console.error('Error fetching User Profile:', error);
        setFormError(error.response.data.message);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            'http://localhost:8003/api/users/getuser'
          );
          console.log("User Profile fetching with refreshed token:", response.data);
        } catch (error) {
          console.error("Error fetching User Profile with refreshed token:", error);
        }
      }
    }
  };

  const updateProfile = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
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
      if (error.response && error.response.status === 400) {
        console.error("Error saving User Profile:", error);
        setFormError(error.response.data.message);
      } 
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.put(
            'http://localhost:8003/api/users/profile',
            payload
          );
          console.log("User Profile updated with refreshed token:", response.data);
        } catch (error) {
          console.error("Error updating User Profile with refreshed token:", error);
        }
      }
    }
  };

  const updatePassword = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8003/api/users/password",
        payload
      );
      console.log("Password updated:", response.data);
      alert(response.data.message); // Display the response messagee
      navigate("/");

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error updating User Password:", error);
        setFormError(error.response.data.message);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.put(
            "http://localhost:8003/api/users/password",
            payload
          );
          console.log("User Password updated with refreshed token:", response.data);
        } catch (error) {
          console.error("Error updating User Password with refreshed token:", error);
        }
      }
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, fetchUserProfile,  
      updateProfile, updatePassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);