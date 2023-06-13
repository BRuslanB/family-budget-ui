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
  const { user, refreshToken, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchCategoryList();
  }, [user, refreshToken]);

  const fetchCategoryList = async () => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        'http://localhost:8001/api/categories'
      );
      console.log("CategoryList fetching:", response.data);
      setCategoryList(response.data);
      console.log("categoryList", categoryList);

    } catch (error) {
      console.error('Error fetching category:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("CategoryContext2.formError=", formError);
      }
    }
  };

  const fetchCategory = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.get(
        `http://localhost:8001/api/categories/${id}`
      );
      console.log("Category fetching:", response.data);
      setCategory(response.data);
      console.log("category", category);
  
    } catch (error) {
      console.error('Error fetching category:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        // console.log("CategoryContext3.formError=", formError);
      }
    }
  };

  const createCategory = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.post(
        "http://localhost:8001/api/categories",
        payload
      );
      console.log("Category created:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error creating category:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("CategoryContext4.formError=", formError);
      }
    }
  };

  const updateCategory = async (payload) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.put(
        "http://localhost:8001/api/categories",
        payload
      );
      console.log("Category updated:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("CategoryContext5.formError=", formError);
      }
    }
  };

  const deleteCategory = async (id) => {
    try {
      const interceptor = createJwtInterceptor(user?.sub, refreshToken?.UUID, logout);
      const axiosInstance = interceptor;
      const response = await axiosInstance.delete(
        `http://localhost:8001/api/categories/${id}`
      );
      console.log("Category deleted:", response.data);
      // alert(response.data.message); // Display the response messagee

    } catch (error) {
      console.error("Error deleting category:", error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data.message);
        console.log("CategoryContext6.formError=", formError);
      }
    }
  };

  return (
    <CategoryContext.Provider value={{ category, categoryList, formError, setFormError, 
      fetchCategory, fetchCategoryList, createCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => useContext(CategoryContext);