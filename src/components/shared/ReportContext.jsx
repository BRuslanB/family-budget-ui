import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const ReportContext = createContext();

export const ReportContextProvider = ({ children }) => {

  const { formError, setFormError } = useFormErrorContext();
 
  const [checkIncomeList, setCheckIncomeList] = useState([]);
  const [checkListByIncome, setCheckListByIncome] = useState(null);
  const [checkExpenseList, setCheckExpenseList] = useState([]);
  const [checkListByExpense, setCheckListByExpense] = useState(null);
  const [checkActorList, setCheckActorList] = useState([]);
  const [checkListByActor, setCheckListByActor] = useState(null);
  const { user, refreshToken, setRefreshToken, logout } = useContext(AuthContext);

  // useEffect(() => {
  //   // console.log("ReportContext.user", user)
  //   // console.log("ReportContext.refreshToken", refreshToken)
  // }, [user, refreshToken]);

  const fetchCheckIncomeList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/incomes/sum'
      );

      if (response.data !== undefined) {
        console.log("CheckIncomeList fetching:", response.data);
        setCheckIncomeList(response.data);
      } else {
        console.log("CheckIncomeList fetching:", null);
        setCheckIncomeList([]);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckIncome:', error);
        setFormError(error.response.data.message);
      }
    }
  };

  const fetchCheckIncomeListDates = async (date1, date2) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/incomes/dates/${date1}/${date2}`
      );

      if (response.data !== undefined) {
        console.log("CheckListIncomeDates fetching:", response.data);
        setCheckIncomeList(response.data);
      } else {
        console.log("CheckListIncomeDates fetching:", null);
        setCheckIncomeList([]);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckIncomeDates:', error);
        setFormError(error.response.data.message);
      }
    }
  };

  const fetchCheckIncomeDates = async (id, date1, date2) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/checks/incomes/${id}/dates/${date1}/${date2}`
      );

      if (response.data !== undefined) {
        console.log("CheckIncomeDates fetching:", response.data);
        setCheckListByIncome(response.data);
      } else {
        console.log("CheckIncomeDates fetching:", null);
        setCheckListByIncome(null);
      }
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckIncomeDates:', error);
        setFormError(error.response.data.message);
        setCheckListByIncome(null);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/checks/incomes/${id}/dates/${date1}/${date2}`
          );
          console.log("CheckIncomeDates fetching with refreshed token:", response.data);
          setCheckListByIncome(response.data);
        } catch (error) {
          console.error("Error fetching CheckIncomeDates with refreshed token:", error);
          setCheckListByIncome(null);
        }
      }
    }
  };

  const fetchCheckIncome = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/checks/incomes/${id}`
      );

      if (response.data !== undefined) {
        console.log("CheckListByIncome fetching:", response.data);
        setCheckListByIncome(response.data);
      } else {
        console.log("CheckListByIncome fetching:", null);
        setCheckListByIncome(null);
      }
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckListByIncome:', error);
        setFormError(error.response.data.message);
        setCheckListByIncome(null);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/checks/incomes/${id}`
          );
          console.log("CheckListByIncome fetching with refreshed token:", response.data);
          setCheckListByIncome(response.data);
        } catch (error) {
          console.error("Error fetching CheckListByIncome with refreshed token:", error);
          setCheckListByIncome(null);
        }
      }
    }
  };

  const fetchCheckExpenseList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/expenses/sum'
      );

      if (response.data !== undefined) {
        console.log("CheckExpenseList fetching:", response.data);
        setCheckExpenseList(response.data);
      } else {
        console.log("CheckExpenseList fetching:", null);
        setCheckExpenseList([]);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckExpense:', error);
        setFormError(error.response.data.message);
      }
    }
  };

  const fetchCheckExpenseListDates = async (date1, date2) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/expenses/dates/${date1}/${date2}`
      );

      if (response.data !== undefined) {
        console.log("CheckListExpenseDates fetching:", response.data);
        setCheckExpenseList(response.data);
      } else {
        console.log("CheckListExpenseDates fetching:", null);
        setCheckExpenseList([]);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckExpenseDates:', error);
        setFormError(error.response.data.message);
      }
    }
  };

  const fetchCheckExpenseDates = async (id, date1, date2) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/checks/expenses/${id}/dates/${date1}/${date2}`
      );

      if (response.data !== undefined) {
        console.log("CheckExpenseDates fetching:", response.data);
        setCheckListByExpense(response.data);
      } else {
        console.log("CheckExpenseDates fetching:", null);
        setCheckListByExpense(null);
      }
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckExpenseDates:', error);
        setFormError(error.response.data.message);
        setCheckListByExpense(null);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/checks/expenses/${id}/dates/${date1}/${date2}`
          );
          console.log("CheckExpenseDates fetching with refreshed token:", response.data);
          setCheckListByExpense(response.data);
        } catch (error) {
          console.error("Error fetching CheckExpenseDates with refreshed token:", error);
          setCheckListByExpense(null);
        }
      }
    }
  };

  const fetchCheckExpense = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/checks/expenses/${id}`
      );

      if (response.data !== undefined) {
        console.log("CheckListByExpense fetching:", response.data);
        setCheckListByExpense(response.data);
      } else {
        console.log("CheckListByExpense fetching:", null);
        setCheckListByExpense(null);
      }
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckListByExpense:', error);
        setFormError(error.response.data.message);
        setCheckListByExpense(null);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/checks/expenses/${id}`
          );
          console.log("CheckListByExpense fetching with refreshed token:", response.data);
          setCheckListByExpense(response.data);
        } catch (error) {
          console.error("Error fetching CheckListByExpense with refreshed token:", error);
          setCheckListByExpense(null);
        }
      }
    }
  };

  const fetchCheckActorList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/actors/sum'
      );

      if (response.data !== undefined) {
        console.log("CheckActorList fetching:", response.data);
        setCheckActorList(response.data);
      } else {
        console.log("CheckActorList fetching:", null);
        setCheckActorList([]);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckActor:', error);
        setFormError(error.response.data.message);
      }
    }
  };

  const fetchCheckActorListDates = async (date1, date2) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/actors/dates/${date1}/${date2}`
      );

      if (response.data !== undefined) {
        console.log("CheckListActorDates fetching:", response.data);
        setCheckActorList(response.data);
      } else {
        console.log("CheckListActorDates fetching:", null);
        setCheckActorList([]);
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckActorDates:', error);
        setFormError(error.response.data.message);
      }
    }
  };

  const fetchCheckActorDates = async (id, date1, date2) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/checks/actors/${id}/dates/${date1}/${date2}`
      );

      if (response.data !== undefined) {
        console.log("CheckActorDates fetching:", response.data);
        setCheckListByActor(response.data);
      } else {
        console.log("CheckActorDates fetching:", null);
        setCheckListByActor(null);
      }
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckActorDates:', error);
        setFormError(error.response.data.message);
        setCheckListByActor(null);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/checks/actors/${id}/dates/${date1}/${date2}`
          );
          console.log("CheckActorDates fetching with refreshed token:", response.data);
          setCheckListByActor(response.data);
        } catch (error) {
          console.error("Error fetching CheckActorDates with refreshed token:", error);
          setCheckListByActor(null);
        }
      }
    }
  };

  const fetchCheckActor = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/checks/actors/${id}`
      );

      if (response.data !== undefined) {
        console.log("CheckListByActor fetching:", response.data);
        setCheckListByActor(response.data);
      } else {
        console.log("CheckListByActor fetching:", null);
        setCheckListByActor(null);
      }
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching CheckListByActor:', error);
        setFormError(error.response.data.message);
        setCheckListByActor(null);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/checks/actors/${id}`
          );
          console.log("CheckListByActor fetching with refreshed token:", response.data);
          setCheckListByActor(response.data);
        } catch (error) {
          console.error("Error fetching CheckListByActor with refreshed token:", error);
          setCheckListByActor(null);
        }
      }
    }
  };

  return (
    <ReportContext.Provider value={{ 
      checkListByIncome, setCheckListByIncome, checkIncomeList, setCheckIncomeList, 
      fetchCheckIncome, fetchCheckIncomeDates, fetchCheckIncomeList, fetchCheckIncomeListDates,
      checkListByExpense, setCheckListByExpense, checkExpenseList, setCheckExpenseList, 
      fetchCheckExpense, fetchCheckExpenseDates, fetchCheckExpenseList, fetchCheckExpenseListDates,
      checkListByActor, setCheckListByActor, checkActorList, setCheckActorList, 
      fetchCheckActor, fetchCheckActorDates, fetchCheckActorList, fetchCheckActorListDates
    }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => useContext(ReportContext);