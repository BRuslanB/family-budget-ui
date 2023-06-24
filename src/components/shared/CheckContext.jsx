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
  const { user, refreshToken, setRefreshToken, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log("CheckContext.user", user)
    console.log("CheckContext.refreshToken", refreshToken)
    // fetchCheckList();
  }, [user, refreshToken]);

  const fetchCheckList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/checks'
      );

      if (response.data !== undefined) {
        console.log("CheckList fetching:", response.data);
        setCheckList(response.data);
      } else {
        console.log("CheckList fetching:", null);
        setCheckList([]);
      }
      console.log("checkList", checkList);

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Check:', error);
        setFormError(error.response.data.message);
        // console.log("CheckContext2.formError=", formError);
      }
    }
  };

  const fetchCheck = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/checks/${id}`
      );

      if (response.data !== undefined) {
        console.log("Check fetching:", response.data);
        setCheck(response.data);
      } else {
        console.log("Check fetching:", null);
        setCheck(null);
      }
      console.log("Check", check);
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Check:', error);
        setFormError(error.response.data.message);
        // console.log("CheckContext3.formError=", formError);
        setCheck(null);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/checks/${id}`
          );
          console.log("Check fetching with refreshed token:", response.data);
          setCheck(response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error fetching Check with refreshed token:", error);
          setCheck(null);
        }
      }
    }
  };

  const createCheck = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8001/api/checks",
        payload
      );
      console.log("Check created:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error creating Check:", error);
        setFormError(error.response.data.message);
        // console.log("CheckContext4.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.post(
            "http://localhost:8001/api/checks",
            payload
          );
          console.log("Check created with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error creating Check with refreshed token:", error);
        }
      }
    }
  };

  const updateCheck = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/checks",
        payload
      );
      console.log("Check updated:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error updating Check:", error);
        setFormError(error.response.data.message);
        // console.log("CheckContext5.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.put(
            "http://localhost:8001/api/checks",
            payload
          );
          console.log("Check updated with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error updating Check with refreshed token:", error);
        }
      }
    }
  };

  const updateCheckObject = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/checks/object",
        payload
      );
      console.log("Check Object updated:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error updating Check Object:", error);
        setFormError(error.response.data.message);
        // console.log("CheckContext5.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.put(
            "http://localhost:8001/api/checks/object",
            payload
          );
          console.log("Check Object updated with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error updating Check Object with refreshed token:", error);
        }
      }
    }
  };

  const deleteCheck = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8001/api/checks/${id}`
      );
      console.log("Check deleted:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error deleting Check:", error);
        setFormError(error.response.data.message);
        // console.log("CheckContext6.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.delete(
            `http://localhost:8001/api/checks/${id}`
          );
          console.log("Check deleted:", response.data);
          // alert(response.data.message); // Display the response messagee
        } catch (error) {
          console.error("Error deleting Check with refreshed token:", error);
        }
      }
    }
  };

  return (
    <CheckContext.Provider value={{ check, setCheck, checkList, fetchCheck,  
      fetchCheckList, createCheck, updateCheck, updateCheckObject, deleteCheck }}>
      {children}
    </CheckContext.Provider>
  );
};

export const useCheckContext = () => useContext(CheckContext);