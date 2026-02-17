import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./ManagerPages.css";

export default function Dashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/attendance/analytics");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-center">
      <div className="card">
        <h1>Dashboard Overview</h1>

        {loading && <p style={{ textAlign: "center" }}>Loading data...</p>}

        {!loading && stats && (
          <div className="summary-grid">
            <div className="summary-box present">
              <h3>{stats.regular}</h3>
              <p>Regular Employees</p>
            </div>

            <div className="summary-box late">
              <h3>{stats.irregular}</h3>
              <p>Irregular Employees</p>
            </div>

            <div className="summary-box half">
              <h3>{stats.lowProductive}</h3>
              <p>Low Productive</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
