import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {

  const navigate = useNavigate();

  return (
    <div className="home-wrapper">

      <div className="overlay">

        <h1 className="home-title">WorkTrack</h1>

        <p className="home-subtitle">
          Smart Employee Attendance & Workforce Management System
        </p>

        <div className="home-buttons">
          <button
            className="employee-btn"
            onClick={() => navigate("/login?role=employee")}
          >
            Employee Login
          </button>

          <button
            className="manager-btn"
            onClick={() => navigate("/login?role=manager")}
          >
            Manager Login
          </button>
        </div>

        <p className="copyright">
          © 2026 WorkTrack HR Solutions
        </p>

      </div>

    </div>
  );
}
