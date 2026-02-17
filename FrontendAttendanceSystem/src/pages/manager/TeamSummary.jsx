import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./ManagerPages.css";

export default function TeamSummary() {

  const [stats, setStats] = useState([
    { name: "Regular Employees", value: 0 },
    { name: "Irregular Employees", value: 0 },
    { name: "Low Productive", value: 0 }
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/attendance/analytics");

        setStats([
          { name: "Regular Employees", value: res.data.regular || 0 },
          { name: "Irregular Employees", value: res.data.irregular || 0 },
          { name: "Low Productive", value: res.data.lowProductive || 0 }
        ]);

      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ["#10b981", "#f97316", "#fbbf24"];

  return (
    <div className="page-center">
      <div className="card report-card">

        <h1>Team Performance</h1>

        {loading ? (
          <p style={{textAlign:"center"}}>Loading analytics...</p>
        ) : (
          <div style={{display:"flex", justifyContent:"center"}}>
            <PieChart width={420} height={340}>
              <Pie
                data={stats}
                cx="50%"
                cy="45%"
                outerRadius={130}
                dataKey="value"
                label
              >
                {stats.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={60}/>
            </PieChart>
          </div>
        )}

      </div>
    </div>
  );
}
