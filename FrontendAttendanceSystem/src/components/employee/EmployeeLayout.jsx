import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./EmployeeLayout.css";

export default function EmployeeLayout() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();   // remove token + role
    navigate("/");          // go back to home
  };

  return (
    <div className="employee-layout">

      {/* LEFT SIDEBAR */}
      <div className="sidebar">

        <h2 className="logo">WorkTrack</h2>

        <nav className="menu">
          <NavLink to="/employee/attendance">Mark Attendance</NavLink>
          <NavLink to="/employee/history">My History</NavLink>
          <NavLink to="/employee/summary">Monthly Summary</NavLink>
          <NavLink to="/employee/stats">Attendance Stats</NavLink>
          <NavLink to="/employee/profile">Profile</NavLink>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </nav>

      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="content">
        <Outlet />
      </div>

    </div>
  );
}
