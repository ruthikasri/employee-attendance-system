import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./EmployeePages.css";

export default function AttendanceStats() {

  const [stats, setStats] = useState([
    { name: "Present", value: 0 },
    { name: "Late", value: 0 },
    { name: "Half Day", value: 0 }
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ⭐ CORRECT ROUTE
        const res = await api.get("/attendance/my-stats");

        setStats([
          { name: "Present", value: res.data.present || 0 },
          { name: "Late", value: res.data.late || 0 },
          { name: "Half Day", value: res.data.half || 0 }
        ]);

      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  if (loading) {
    return (
      <div className="page-center">
        <div className="card">
          <h2>Attendance Statistics</h2>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-center">
      <div className="card">
        <h2>Attendance Statistics</h2>

        <PieChart width={450} height={320}>
          <Pie
            data={stats}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label
          >
            {stats.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

      </div>
    </div>
  );
}
