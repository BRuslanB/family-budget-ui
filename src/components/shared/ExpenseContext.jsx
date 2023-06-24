import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const ExpenseContext = createContext();

export const ExpenseContextProvider = ({ children }) => {

  const { formError, setFormError } = useFormErrorContext();
  // console.log("ExpenseContext1.formError=", formError);

  const [expenseList, setExpenseList] = useState([]);
  const [expense, setExpense] = useState(null);
  const { user, refreshToken, setRefreshToken, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log("ExpenseContext.user", user)
    console.log("ExpenseContext.refreshToken", refreshToken)
    // fetchExpenseList();
  }, [user, refreshToken]);

  const fetchExpenseList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
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
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Expense:', error);
        setFormError(error.response.data.message);
        // console.log("ExpenseContext2.formError=", formError);
      }
    }
  };

  const fetchExpense = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
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
      console.log("Expense", expense);
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Expense:', error);
        setFormError(error.response.data.message);
        // console.log("ExpenseContext3.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/expenses/${id}`
          );
          console.log("Expense fetching with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error fetching Expense with refreshed token:", error);
        }
      }
    }
  };

  const createExpense = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8001/api/expenses",
        payload
      );
      console.log("Expense created:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error creating Expense:", error);
        setFormError(error.response.data.message);
        // console.log("ExpenseContext4.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.post(
            "http://localhost:8001/api/expenses",
            payload
          );
          console.log("Expense created with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error creating Expense with refreshed token:", error);
        }
      }
    }
  };

  const updateExpense = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/expenses",
        payload
      );
      console.log("Expense updated:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error updating Expense:", error);
        setFormError(error.response.data.message);
        // console.log("ExpenseContext5.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.put(
            "http://localhost:8001/api/expenses",
            payload
          );
          console.log("Expense updated with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error updating Expense with refreshed token:", error);
        }
      }
    }
  };

  const deleteExpense = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8001/api/expenses/${id}`
      );
      console.log("Expense deleted:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error deleting Expense:", error);
        setFormError(error.response.data.message);
        // console.log("ExpenseContext6.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.delete(
            `http://localhost:8001/api/expenses/${id}`
          );
          console.log("Expense deleted:", response.data);
          // alert(response.data.message); // Display the response messagee
        } catch (error) {
          console.error("Error deleting Expense with refreshed token:", error);
        }
      }
    }
  };

  return (
    <ExpenseContext.Provider value={{ expense, expenseList, fetchExpense, 
      fetchExpenseList, createExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => useContext(ExpenseContext);