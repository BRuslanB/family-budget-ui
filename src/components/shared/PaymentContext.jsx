import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import { useNavigate } from 'react-router-dom';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";
// Дополнительные импорты и функции, связанные с PaymentContext

const PaymentContext = createContext();

export const PaymentContextProvider = ({ children }) => {
  const { formError, setFormError } = useFormErrorContext();
  useEffect(() => {
    setFormError(""); // Очистка предыдущей ошибки формы при монтировании компонента
  }, []);
  console.log("PaymentContext1.formError=",formError);

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // Выполните запросы к сервисам, связанным с платежами, и обновите состояние
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const createPayment = async (paymentData) => {
    try {
      // Выполните запросы к сервисам, связанным с созданием платежей, и обновите состояние
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  // Дополнительные функции, связанные с платежами

  return (
    <PaymentContext.Provider value={{ payments, formError, setFormError, 
      fetchPayments, createPayment }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => useContext(PaymentContext);