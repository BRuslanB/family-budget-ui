import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const IncomeContext = createContext();

export const IncomeContextProvider = ({ children }) => {
  
  const { formError, setFormError } = useFormErrorContext();
  // console.log("IncomeContext1.formError=", formError);
  const { user, refreshToken, setRefreshToken, logout } = useContext(AuthContext);

  const [incomeList, setIncomeList] = useState([]);
  const [income, setIncome] = useState(null);

  useEffect(() => {
    console.log("IncomeContext.user", user)
    console.log("IncomeContext.refreshToken", refreshToken)
    // fetchIncomeList();
  }, [user, refreshToken]);

  const fetchIncomeList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/incomes'
      );

      if (response.data !== undefined) {
        console.log("IncomeList fetching:", response.data);
        setIncomeList(response.data);
      } else {
        console.log("IncomeList fetching:", null);
        setIncomeList([]);
      }
      console.log("incomeList", incomeList);

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Income:', error);
        setFormError(error.response.data.message);
        // console.log("IncomeContext2.formError=", formError);
      }
    }
  };

  const fetchIncome = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/incomes/${id}`
      );
  
      if (response.data !== undefined) {
        console.log("Income fetching:", response.data);
        setIncome(response.data);
      } else {
        console.log("Income fetching:", null);
        setIncome(null);
      }
      console.log("Income", income);
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Income:', error);
        setFormError(error.response.data.message);
        // console.log("IncomeContext3.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/incomes/${id}`
          );
          console.log("Income fetching with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error fetching Income with refreshed token:", error);
        }
      }
    }
  };

  const createIncome = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8001/api/incomes",
        payload
      );
      console.log("Income", income);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error creating Income:", error);
        setFormError(error.response.data.message);
        // console.log("IncomeContext4.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.post(
            "http://localhost:8001/api/incomes",
            payload
          );
          console.log("Income created with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error creating Income with refreshed token:", error);
        }
      }
    }
  };

  const updateIncome = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/incomes",
        payload
      );
      console.log("Income", income);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error updating Income:", error);
        setFormError(error.response.data.message);
        // console.log("IncomeContext5.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.put(
            "http://localhost:8001/api/incomes",
            payload
          );
          console.log("Income updated with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error updating Income with refreshed token:", error);
        }
      }
    }
  };

  const deleteIncome = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8001/api/incomes/${id}`
      );
      console.log("Income deleted:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error deleting Income:", error);
        setFormError(error.response.data.message);
        // console.log("IncomeContext6.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.delete(
            `http://localhost:8001/api/incomes/${id}`
          );
          console.log("Income deleted:", response.data);
          // alert(response.data.message); // Display the response messagee
        } catch (error) {
          console.error("Error deleting Income with refreshed token:", error);
        }
      }
    }
  };

  return (
    <IncomeContext.Provider value={{ income, incomeList, formError, setFormError, 
      fetchIncome, fetchIncomeList, createIncome, updateIncome, deleteIncome }}>
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncomeContext = () => useContext(IncomeContext);