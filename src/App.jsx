import "./App.css";
import { Route, Routes } from "react-router-dom";
import { FormErrorContextProvider } from "./components/shared/FormErrorContext"; 
import { AuthContextProvider } from "./components/shared/AuthContext";
import { UserContextProvider } from "./components/shared/UserContext"; 
import { CategoryContextProvider } from "./components/shared/CategoryContext"; 
import { ExpenseContextProvider } from "./components/shared/ExpenseContext"; 
import { IncomeContextProvider } from "./components/shared/IncomeContext"; 
import { ActorContextProvider } from "./components/shared/ActorContext"; 
import { CheckContextProvider } from "./components/shared/CheckContext"; 
import Layout from "./components/shared/Layout";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import UserPassword from "./pages/UserPassword";
import Checks from "./pages/Checks";
import Categories from "./pages/Categories";
import Expenses from "./pages/Expenses";
import Incomes from "./pages/Incomes";
import Actors from "./pages/Actors";
 
function App() {
  return (
    <>
      <FormErrorContextProvider>
        <AuthContextProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute accessBy="authenticated">
                      <IncomeContextProvider>
                        <ExpenseContextProvider>
                          <ActorContextProvider>
                            <CheckContextProvider>
                              <Checks />
                            </CheckContextProvider>
                          </ActorContextProvider>
                        </ExpenseContextProvider>
                      </IncomeContextProvider>
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/categories"
                  element={
                    <ProtectedRoute accessBy="authenticated">
                      <CategoryContextProvider>
                        <Categories />
                      </CategoryContextProvider>
                    </ProtectedRoute>
                  }
                  ></Route>
                <Route
                  path="/expenses"
                  element={
                    <ProtectedRoute accessBy="authenticated">
                      <CategoryContextProvider>
                        <ExpenseContextProvider>
                          <Expenses />
                        </ExpenseContextProvider>
                      </CategoryContextProvider>
                    </ProtectedRoute>
                  }
                  ></Route>
                <Route
                  path="/incomes"
                  element={
                    <ProtectedRoute accessBy="authenticated">
                      <IncomeContextProvider>
                        <Incomes />
                      </IncomeContextProvider>
                    </ProtectedRoute>
                  }
                  ></Route>
                <Route
                  path="/actors"
                  element={
                    <ProtectedRoute accessBy="authenticated">
                      <ActorContextProvider>
                        <Actors />
                      </ActorContextProvider>
                    </ProtectedRoute>
                  }
                  ></Route>
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute accessBy="non-authenticated">
                      <Login />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/register"
                  element={
                    <ProtectedRoute accessBy="non-authenticated">
                      <Register />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute accessBy="authenticated">
                      <UserContextProvider>
                        <UserProfile />
                      </UserContextProvider>
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/password"
                  element={
                    <ProtectedRoute accessBy="authenticated">
                      <UserContextProvider>
                        <UserPassword />
                      </UserContextProvider>
                    </ProtectedRoute>
                  }
                ></Route>
              </Routes>
            </Layout>
        </AuthContextProvider>
      </FormErrorContextProvider>
    </>
  );
}

export default App;