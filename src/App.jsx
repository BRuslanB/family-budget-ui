import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./components/shared/AuthContext";
import { UserContextProvider } from "./components/shared/UserContext"; 
import { FormErrorContextProvider } from "./components/shared/FormErrorContext"; 
import Layout from "./components/shared/Layout";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import UserPassword from "./pages/UserPassword";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
 
function App() {
  return (
    <>
      <FormErrorContextProvider>
        <AuthContextProvider>
          <UserContextProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute accessBy="authenticated">
                      <Payments />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute accessBy="authenticated">
                      <Settings />
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
                      <UserProfile />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/password"
                  element={
                    <ProtectedRoute accessBy="authenticated">
                      <UserPassword />
                    </ProtectedRoute>
                  }
                ></Route>
              </Routes>
            </Layout>
          </UserContextProvider>
        </AuthContextProvider>
      </FormErrorContextProvider>
    </>
  );
}

export default App;