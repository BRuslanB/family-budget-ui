import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import { useRefreshContext } from './RefreshContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const ReceiptContext = createContext();

export const ReceiptContextProvider = ({ children }) => {
  const { formError, setFormError } = useFormErrorContext();
  // console.log("ReceiptContext1.formError=", formError);
  const refreshContext = useRefreshContext();

  const [receipt, setReceipt] = useState(null);
  const [receiptId, setReceiptId] = useState("");
  const { user, refreshToken, setRefreshToken, logout } = useContext(AuthContext);

  useEffect(() => { 
    console.log("ReceiptContext.user", user)
    console.log("ReceiptContext.refreshToken", refreshToken)
  }, [user, refreshToken]);

  useEffect(() => {
    console.log("ReceiptContext -> Количество запросов в очереди:", 
      refreshContext.requestQueue.length, refreshContext.requestQueue);
  }, [refreshContext.requestQueue]);

  const fetchReceipt = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8002/api/receipts/${id}`
      );
      console.log("Receipt fetching:", response.data);
      setReceipt(response.data);
      console.log("receipt", receipt);
  
    } catch (error) {
      console.error('Error fetching Receipt:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("ReceiptContext3.formError=", formError);
      }
    }
  };

  const createReceipt = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8002/api/receipts",
        payload
      );
      console.log("Receipt created:", response.data);
      setReceiptId(response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error creating Receipt:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("ReceiptContext4.formError=", formError);
      }
    }
  };

  const updateReceipt = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8002/api/receipts",
        payload
      );
      console.log("Receipt updated:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error updating Receipt:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("ReceiptContext5.formError=", formError);
      }
    }
  };

  const deleteReceipt = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout, refreshContext);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8002/api/receipts/${id}`
      );
      console.log("Receipt deleted:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error deleting Receipt:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("ReceiptContext6.formError=", formError);
      }
    }
  };

  return (
    <ReceiptContext.Provider value={{ receipt, setReceipt, 
      receiptId, setReceiptId, formError, setFormError, 
      fetchReceipt, createReceipt, updateReceipt, deleteReceipt }}>
      {children}
    </ReceiptContext.Provider>
  );
};

export const useReceiptContext = () => useContext(ReceiptContext);