import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const BudgetContext = createContext();

export const BudgetContextProvider = ({ children }) => {

  const { formError, setFormError } = useFormErrorContext();
 
  const [budgetList, setBudgetList] = useState([]);
  const [checkListByDate, setCheckListByDate] = useState([]);
  const { user, refreshToken, setRefreshToken, logout } = useContext(AuthContext);

  // useEffect(() => {
  //   // console.log("BudgetContext.user", user)
  //   // console.log("BudgetContext.refreshToken", refreshToken)
  // }, [user, refreshToken]);

  const fetchBudgetList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/budgets'
      );

      if (response.data !== undefined) {
        console.log("BudgetList fetching:", response.data);
        setBudgetList(response.data);
      } else {
        console.log("BudgetList fetching:", null);
        setBudgetList([]);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Budget:', error);
        setFormError(error.response.data.message);
      }
    }
  };

  const fetchBudgetListDates = async (date1, date2) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/budgets/dates/${date1}/${date2}`
      );

      if (response.data !== undefined) {
        console.log("BudgetListDates fetching:", response.data);
        setBudgetList(response.data);
      } else {
        console.log("BudgetListDates fetching:", null);
        setBudgetList([]);
      }
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching BudgetListDates:', error);
        setFormError(error.response.data.message);
        setBudget(null);
      }
    }
  };

  const fetchCheckListDate = async (checkDate) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/checks/date/${checkDate}`
      );

      if (response.data !== undefined) {
        console.log("CheckListDate fetching:", response.data);
        setCheckListByDate(response.data);
      } else {
        console.log("CheckListDate fetching:", null);
        setCheckListByDate([]);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckListDate:', error);
        setFormError(error.response.data.message);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/checks/date/${checkDate}`
          );
          console.log("CheckListDate fetching with refreshed token:", response.data);
          setCheckListByDate(response.data);
        } catch (error) {
          console.error("Error fetching CheckListDate with refreshed token:", error);
          setCheckListByDate([]);
        }
      }
    }
  };

  return (
    <BudgetContext.Provider value={{ 
      budgetList, setBudgetList, fetchBudgetList, fetchBudgetListDates,
      checkListByDate, setCheckListByDate, fetchCheckListDate
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetContext = () => useContext(BudgetContext);