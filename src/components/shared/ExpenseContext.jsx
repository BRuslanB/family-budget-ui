import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import { useRefreshContext } from './RefreshContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const ExpenseContext = createContext();

export const ExpenseContextProvider = ({ children }) => {
  const { formError, setFormError } = useFormErrorContext();
  // console.log("ExpenseContext1.formError=", formError);
  const refreshContext = useRefreshContext();

  const [expenseList, setExpenseList] = useState([]);
  const [expense, setExpense] = useState(null);
  const { user, refreshToken, setRefreshToken, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchExpenseList();
  }, [user, refreshToken]);

  useEffect(() => {
    console.log("ExpenseContext -> Количество запросов в очереди:", 
      refreshContext.requestQueue.length, refreshContext.requestQueue);
  }, [refreshContext.requestQueue]);

  const fetchExpenseList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/expenses'
      );

      if (response.data !== undefined) {
        console.log("ExpenseList fetching:", response.data);
        setExpenseList(response.data);
      } else {
        console.log("ExpenseList fetching:", null);
        setExpenseList([]);
      }
      console.log("expenseList", expenseList);

    } catch (error) {
      console.error('Error fetching expense:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("ExpenseContext2.formError=", formError);
      }
    }
  };

  const fetchExpense = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/expenses/${id}`
      );

      if (response.data !== undefined) {
        console.log("Expense fetching:", response.data);
        setExpense(response.data);
      } else {
        console.log("Expense fetching:", null);
        setExpense(null);
      }
      console.log("check", check);
  
    } catch (error) {
      console.error('Error fetching expense:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("ExpenseContext3.formError=", formError);
      }
    }
  };

  const createExpense = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8001/api/expenses",
        payload
      );
      console.log("Expense created:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error creating expense:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("ExpenseContext4.formError=", formError);
      }
    }
  };

  const updateExpense = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/expenses",
        payload
      );
      console.log("Expense updated:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error updating expense:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("ExpenseContext5.formError=", formError);
      }
    }
  };

  const deleteExpense = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8001/api/expenses/${id}`
      );
      console.log("Expense deleted:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error deleting expense:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("ExpenseContext6.formError=", formError);
      }
    }
  };

  return (
    <ExpenseContext.Provider value={{ expense, expenseList, formError, setFormError, 
      fetchExpense, fetchExpenseList, createExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => useContext(ExpenseContext);