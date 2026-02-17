import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./managerLayout.css";

export default function ManagerLayout() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="manager-layout">

      {/* Sidebar */}
      <div className="manager-sidebar">

        <h2 className="manager-logo">WorkTrack Manager</h2>

        <nav className="manager-menu">
          <NavLink to="/manager/dashboard">Dashboard</NavLink>
          <NavLink to="/manager/employees">All Employees</NavLink>
          <NavLink to="/manager/filter">Filter Attendance</NavLink>
          <NavLink to="/manager/team">Team Summary</NavLink>
          <NavLink to="/manager/reports">Reports</NavLink>

          <button className="manager-logout" onClick={logout}>
            Logout
          </button>
        </nav>

      </div>

      {/* Content Area */}
      <div className="manager-content">
        <Outlet />
      </div>

    </div>
  );
}
