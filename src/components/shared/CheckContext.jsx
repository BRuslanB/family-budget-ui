import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const CheckContext = createContext();

export const CheckContextProvider = ({ children }) => {
  const { formError, setFormError } = useFormErrorContext();
  // console.log("CheckContext1.formError=", formError);

  const [checkList, setCheckList] = useState([]);
  const [check, setCheck] = useState(null);
  const { user, refreshToken, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchCheckList();
  }, [user, refreshToken]);

  const fetchCheckList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/checks'
      );
      console.log("CheckList fetching:", response.data);
      setCheckList(response.data);
      console.log("checkList", checkList);

    } catch (error) {
      console.error('Error fetching Check:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("CheckContext2.formError=", formError);
      }
    }
  };

  const fetchCheck = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/checks/${id}`
      );
      console.log("Check fetching:", response.data);
      setCheck(response.data);
      console.log("check", check);
  
    } catch (error) {
      console.error('Error fetching Check:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("CheckContext3.formError=", formError);
      }
    }
  };

  const createCheck = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8001/api/checks",
        payload
      );
      console.log("Check created:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error creating Check:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("CheckContext4.formError=", formError);
      }
    }
  };

  const updateCheck = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/checks",
        payload
      );
      console.log("Check updated:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error updating Check:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("CheckContext5.formError=", formError);
      }
    }
  };

  const updateCheckObject = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/checks/object",
        payload
      );
      console.log("Check Object updated:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error updating Check Object:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("CheckContext5.formError=", formError);
      }
    }
  };

  const deleteCheck = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8001/api/checks/${id}`
      );
      console.log("Check deleted:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error deleting Check:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("CheckContext6.formError=", formError);
      }
    }
  };

  return (
    <CheckContext.Provider value={{ check, checkList, formError, setFormError, 
      fetchCheck, fetchCheckList, createCheck, updateCheck, updateCheckObject, deleteCheck }}>
      {children}
    </CheckContext.Provider>
  );
};

export const useCheckContext = () => useContext(CheckContext);