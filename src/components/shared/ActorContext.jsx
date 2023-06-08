import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const ActorContext = createContext();

export const ActorContextProvider = ({ children }) => {
  const { formError, setFormError } = useFormErrorContext();
  // console.log("ActorContext1.formError=", formError);

  const [actorList, setActorList] = useState([]);
  const [actor, setActor] = useState(null);
  const { user, refreshToken, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchActorList();
  }, [user, refreshToken]);

  const fetchActorList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/actors'
      );
      console.log("ActorList fetching:", response.data);
      setActorList(response.data);
      console.log("actorList", actorList);

    } catch (error) {
      console.error('Error fetching actor:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("ActorContext2.formError=", formError);
      }
    }
  };

  const fetchActor = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/actors/${id}`
      );
      console.log("Actor fetching:", response.data);
      setActor(response.data);
      console.log("actor", actor);
  
    } catch (error) {
      console.error('Error fetching actor:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("ActorContext3.formError=", formError);
      }
    }
  };

  const createActor = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8001/api/actors",
        payload
      );
      console.log("Actor created:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error creating actor:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("ActorContext4.formError=", formError);
      }
    }
  };

  const updateActor = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/actors",
        payload
      );
      console.log("Actor updated:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error updating actor:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("ActorContext5.formError=", formError);
      }
    }
  };

  const deleteActor = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8001/api/actors/${id}`
      );
      console.log("Actor deleted:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error deleting actor:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("ActorContext6.formError=", formError);
      }
    }
  };

  return (
    <ActorContext.Provider value={{ actor, actorList, formError, setFormError, 
      fetchActor, fetchActorList, createActor, updateActor, deleteActor }}>
      {children}
    </ActorContext.Provider>
  );
};

export const useActorContext = () => useContext(ActorContext);