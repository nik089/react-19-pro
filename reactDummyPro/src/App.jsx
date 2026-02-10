import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/User-Management/Users-List/Users";
import AddUser from "./pages/User-Management/Add-User/addUser";
import Roles from "./pages/User-Management/Roles/Role";
import Settings from "./pages/Settings/Setting";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Landing from "./pages/Landing/Landing";

function App() {
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem("isAuth") === "true");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const finish = () => {
      setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 600);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }

    return () => {
      isMounted = false;
      window.removeEventListener("load", finish);
    };
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      setIsAuth(localStorage.getItem("isAuth") === "true");
    };
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-change", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-change", syncAuth);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="global-loader">
        <div className="global-loader__ring"></div>
        <div className="global-loader__text">
          <span>Preparing your workspace</span>
          <strong>User Management</strong>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: "12px",
            background: "#ffffff",
            color: "#0f172a",
            boxShadow: "0 14px 35px rgba(15, 23, 42, 0.15)"
          },
          success: {
            style: { border: "1px solid rgba(34, 197, 94, 0.3)" }
          },
          error: {
            style: { border: "1px solid rgba(239, 68, 68, 0.3)" }
          }
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={isAuth ? <MainLayout /> : <Navigate to="/login" replace />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
