import "./App.css";
import Layout from "./components/shared/Layout";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import { AuthContextProvider } from "./components/shared/AuthContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";
 
function App() {
  return (
    <>
      <AuthContextProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />}></Route>
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
              path="/user-profile"
              element={
                <ProtectedRoute accessBy="authenticated">
                  <UserProfile />
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </Layout>
      </AuthContextProvider>
    </>
  );
}

export default App;