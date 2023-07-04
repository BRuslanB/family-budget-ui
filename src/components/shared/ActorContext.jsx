import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const ActorContext = createContext();

export const ActorContextProvider = ({ children }) => {
  const { formError, setFormError } = useFormErrorContext();

  const [actorList, setActorList] = useState([]);
  const [actor, setActor] = useState(null);
  const { user, refreshToken, setRefreshToken, logout } = useContext(AuthContext);

  // useEffect(() => {
  //   // console.log("ActorContext.user", user)
  //   // console.log("ActorContext.refreshToken", refreshToken)
  // }, [user, refreshToken]);

  const fetchActorList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/actors'
      );

      if (response.data !== undefined) {
        console.log("ActorList fetching:", response.data);
        setActorList(response.data);
      } else {
        console.log("CategoryList fetching:", null);
        setActorList([]);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Actor:', error);
        setFormError(error.response.data.message);
      }
    }
  };

  const fetchActor = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/actors/${id}`
      );

      if (response.data !== undefined) {
        console.log("Actor fetching:", response.data);
        setActor(response.data);
      } else {
        console.log("Actor fetching:", null);
        setActor(null);
      }
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Actor:', error);
        setFormError(error.response.data.message);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/actors/${id}`
          );
          console.log("Actor fetching with refreshed token:", response.data);
        } catch (error) {
          console.error("Error fetching Actor with refreshed token:", error);
        }
      }
    }
  };

  const createActor = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8001/api/actors",
        payload
      );
      console.log("Actor created:", response.data);
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error creating Actor:", error);
        setFormError(error.response.data.message);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.post(
            "http://localhost:8001/api/actors",
            payload
          );
          console.log("Actor created with refreshed token:", response.data);
        } catch (error) {
          console.error("Error creating Actor with refreshed token:", error);
        }
      }
    }
  };    
  
  const updateActor = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/actors",
        payload
      );
      console.log("Actor updated:", response.data);

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error updating Actor:", error);
        setFormError(error.response.data.message);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.put(
            "http://localhost:8001/api/actors",
            payload
          );
          console.log("Actor updated with refreshed token:", response.data);
        } catch (error) {
          console.error("Error updating Actor with refreshed token:", error);
        }
      }
    }
  };

  const deleteActor = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8001/api/actors/${id}`
      );
      console.log("Actor deleted:", response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error deleting Actor:", error);
        setFormError(error.response.data.message);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.delete(
            `http://localhost:8001/api/actors/${id}`
          );
          console.log("Actor deleted:", response.data);
        } catch (error) {
          console.error("Error deleting Actor with refreshed token:", error);
        }
      }
    }
  };

  return (
    <ActorContext.Provider value={{ actor, actorList, fetchActor, 
      fetchActorList, createActor, updateActor, deleteActor }}>
      {children}
    </ActorContext.Provider>
  );
};

export const useActorContext = () => useContext(ActorContext);