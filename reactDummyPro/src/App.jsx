import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
