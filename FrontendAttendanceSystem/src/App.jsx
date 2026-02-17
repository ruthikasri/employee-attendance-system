import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/common/Home";
import Login from "./pages/common/Login";
import Register from "./pages/employee/Register";

import EmployeeLayout from "./components/employee/EmployeeLayout";
import ManagerLayout from "./components/manager/ManagerLayout";

import MarkAttendance from "./pages/employee/MarkAttendance";
import MyHistory from "./pages/employee/MyHistory";
import MonthlySummary from "./pages/employee/MonthlySummary";
import AttendanceStats from "./pages/employee/AttendanceStats";
import Profile from "./pages/employee/Profile";

import Dashboard from "./pages/manager/Dashboard";
import AllEmployees from "./pages/manager/AllEmployees";
import FilterAttendance from "./pages/manager/FilterAttendance";
import Reports from "./pages/manager/Reports";
import TeamSummary from "./pages/manager/TeamSummary";

import ProtectedRoute from "./components/manager/ProtectedRoute";

function App() {

  return (
    <Routes>

      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={
        localStorage.getItem("role")==="manager"
          ? <Navigate to="/" />
          : <Register />
      }/>

      {/* ================= EMPLOYEE DASHBOARD ================= */}

      <Route path="/employee" element={
        <ProtectedRoute role="employee">
          <EmployeeLayout/>
        </ProtectedRoute>
      }>

        <Route index element={<Navigate to="attendance" />} />
        <Route path="attendance" element={<MarkAttendance/>}/>
        <Route path="history" element={<MyHistory/>}/>
        <Route path="summary" element={<MonthlySummary/>}/>
        <Route path="stats" element={<AttendanceStats/>}/>
        <Route path="profile" element={<Profile/>}/>

      </Route>

      {/* ================= MANAGER DASHBOARD ================= */}

      <Route path="/manager" element={
        <ProtectedRoute role="manager">
          <ManagerLayout/>
        </ProtectedRoute>
      }>

        <Route index element={<Navigate to="dashboard" />} />

        <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="employees" element={<AllEmployees/>}/>
        <Route path="filter" element={<FilterAttendance/>}/>
        <Route path="team" element={<TeamSummary/>}/>
        <Route path="reports" element={<Reports/>}/>

      </Route>

      {/* Unknown URL */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;
