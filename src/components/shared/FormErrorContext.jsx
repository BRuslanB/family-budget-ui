import { createContext, useContext, useState } from 'react';

const FormErrorContext = createContext();

export const FormErrorContextProvider = ({ children }) => {
  const [formError, setFormError] = useState('');

  return (
    <FormErrorContext.Provider value={{ formError, setFormError }}>
      {children}
    </FormErrorContext.Provider>
  );
};

export const useFormErrorContext = () => useContext(FormErrorContext);