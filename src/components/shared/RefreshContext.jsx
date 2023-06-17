import { useContext, createContext, useState, useEffect } from 'react';
import AuthContext from "./AuthContext";

export const RefreshContext = createContext();

export const RefreshContextProvider = ({ children }) => {

  const { user, refreshToken } = useContext(AuthContext);

//   const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [requestQueue, setRequestQueue] = useState([]);

  useEffect(() => { 
    console.log("RefreshContext.user", user)
    console.log("RefreshContext.refreshToken", refreshToken)
  }, [user, refreshToken]);

  const enqueueRequest = (request) => {
    setRequestQueue((prevQueue) => [...prevQueue, request]);
    // console.log("Новая очередь запросов:", request);
    // console.log("RefreshContext.requestQueue.length", requestQueue.length);
  };

  return (
    <RefreshContext.Provider value={{ requestQueue, setRequestQueue, enqueueRequest }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefreshContext = () => useContext(RefreshContext);