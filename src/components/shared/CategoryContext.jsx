import { createContext, useContext, useState, useEffect } from 'react';
import { useFormErrorContext } from './FormErrorContext';
import AuthContext from "./AuthContext";
import createJwtInterceptor from "./jwtInterceptor";

const CategoryContext = createContext();

export const CategoryContextProvider = ({ children }) => {

  const { formError, setFormError } = useFormErrorContext();
  // console.log("CategoryContext1.formError=", formError);

  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState(null);
  const { user, refreshToken, setRefreshToken, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log("CategoryContext.user", user)
    console.log("CategoryContext.refreshToken", refreshToken)
    // fetchCategoryList();
  }, [user, refreshToken]);

  const fetchCategoryList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/categories'
      );

      if (response.data !== undefined) {
        console.log("CategoryList fetching:", response.data);
        setCategoryList(response.data);
      } else {
        console.log("CategoryList fetching:", null);
        setCategoryList([]);
      }
      console.log("categoryList", categoryList);

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Category:', error);
        setFormError(error.response.data.message);
        // console.log("CategoryContext2.formError=", formError);
      }
    }
  };

  const fetchCategory = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/categories/${id}`
      );

      if (response.data !== undefined) {
        console.log("Category fetching:", response.data);
        setCategory(response.data);
      } else {
        console.log("Category fetching:", null);
        setCategory(null);
      }
      console.log("Category", category);
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Error fetching Category:', error);
        setFormError(error.response.data.message);
        // console.log("CategoryContext3.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.get(
            `http://localhost:8001/api/categories/${id}`
          );
          console.log("Category fetching with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error fetching Category with refreshed token:", error);
        }
      }
    }
  };

  const createCategory = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8001/api/categories",
        payload
      );
      console.log("Category created:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error creating Category:", error);
        setFormError(error.response.data.message);
        // console.log("CategoryContext4.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.post(
            "http://localhost:8001/api/categories",
            payload
          );
          console.log("Category created with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error creating Category with refreshed token:", error);
        }
      }
    }
  };

  const updateCategory = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/categories",
        payload
      );
      console.log("Category updated:", response.data);
      // alert(response.data.message); // Display the response message

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error updating Category:", error);
        setFormError(error.response.data.message);
        // console.log("CategoryContext5.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.put(
            "http://localhost:8001/api/categories",
            payload
          );
          console.log("Category updated with refreshed token:", response.data);
          // alert(response.data.message); // Display the response message
        } catch (error) {
          console.error("Error updating Category with refreshed token:", error);
        }
      }
    }
  };

  const deleteCategory = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, 
        setRefreshToken, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8001/api/categories/${id}`
      );
      console.log("Category deleted:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Error deleting Category:", error);
        setFormError(error.response.data.message);
        // console.log("CategoryContext6.formError=", formError);
      }
      if (error.response && error.response.status === 403) {
        const newInterceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, setRefreshToken, logout);
        const newAxiosInstance = newInterceptor;
        try {
          const response = await newAxiosInstance.delete(
            `http://localhost:8001/api/categories/${id}`
          );
          console.log("Category deleted:", response.data);
          // alert(response.data.message); // Display the response messagee
        } catch (error) {
          console.error("Error deleting Category with refreshed token:", error);
        }
      }
    }
  };

  return (
    <CategoryContext.Provider value={{ category, categoryList, fetchCategory, 
      fetchCategoryList, createCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => useContext(CategoryContext);