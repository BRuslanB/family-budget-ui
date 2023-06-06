import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const IncomeContext = createContext();

export const IncomeContextProvider = ({ children }) => {
  const { formError, setFormError } = useFormErrorContext();
  console.log("IncomeContext1.formError=", formError);

  const [incomeList, setIncomeList] = useState([]);
  const [income, setIncome] = useState(null);
  const { user, refreshToken } = useContext(AuthContext);

  useEffect(() => {
    fetchIncomeList();
  }, [user, refreshToken]);

  const fetchIncomeList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/incomes'
      );
      console.log("IncomeList fetching:", response.data);
      setIncomeList(response.data);
      console.log("incomeList", incomeList);

    } catch (error) {
      console.error('Error fetching income:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("IncomeContext2.formError=", formError);
      }
    }
  };

  const fetchIncome = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/incomes/${id}`
      );
      console.log("Income fetching:", response.data);
      setIncome(response.data);
      console.log("income", income);
  
    } catch (error) {
      console.error('Error fetching income:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("IncomeContext3.formError=", formError);
      }
    }
  };

  const createIncome = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8001/api/incomes",
        payload
      );
      console.log("income", income);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error creating income:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("IncomeContext4.formError=", formError);
      }
    }
  };

  const updateIncome = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/incomes",
        payload
      );
      console.log("income", income);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error updating income:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("IncomeContext5.formError=", formError);
      }
    }
  };

  const deleteIncome = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8001/api/incomes/${id}`
      );
      console.log("Income deleted:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error deleting income:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("IncomeContext6.formError=", formError);
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