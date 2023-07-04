import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const CheckContext = createContext();

export const CheckContextProvider = ({ children }) => {

  const { formError, setFormError } = useFormErrorContext();
 
  const [checkList, setCheckList] = useState([]);
  const [check, setCheck] = useState(null);
  const { user, refreshToken, setRefreshToken, logout } = useContext(AuthContext);

  // useEffect(() => {
  //   // console.log("CheckContext.user", user)
  //   // console.log("CheckContext.refreshToken", refreshToken)
  // }, [user, refreshToken]);

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

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Check:', error);
        setFormError(error.response.data.message);
      }
    }
  };

  const fetchCheckListDates = async (date1, date2) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/checks/dates/${date1}/${date2}`
      );

      if (response.data !== undefined) {
        console.log("CheckListDates fetching:", response.data);
        setCheckList(response.data);
      } else {
        console.log("CheckListDates fetching:", null);
        setCheckList([]);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckListDates:', error);
        setFormError(error.response.data.message);
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
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Check:', error);
        setFormError(error.response.data.message);
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

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error creating Check:", error);
        setFormError(error.response.data.message);
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

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error updating Check:", error);
        setFormError(error.response.data.message);
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

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error updating Check Object:", error);
        setFormError(error.response.data.message);
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

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error deleting Check:", error);
        setFormError(error.response.data.message);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.delete(
            `http://localhost:8001/api/checks/${id}`
          );
          console.log("Check deleted:", response.data);
        } catch (error) {
          console.error("Error deleting Check with refreshed token:", error);
        }
      }
    }
  };

  return (
    <CheckContext.Provider value={{ check, setCheck, checkList, setCheckList, 
      fetchCheck, fetchCheckList, fetchCheckListDates, 
      createCheck, updateCheck, updateCheckObject, deleteCheck }}>
      {children}
    </CheckContext.Provider>
  );
};

export const useCheckContext = () => useContext(CheckContext);