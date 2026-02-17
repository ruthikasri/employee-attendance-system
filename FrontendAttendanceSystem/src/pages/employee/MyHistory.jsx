import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./EmployeePages.css";

export default function MyHistory() {
  const [records, setRecords] = useState([]);

  /* convert ISO time -> Indian readable time */
  const formatTime = (time) => {
    if (!time) return "-";
    return new Date(time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/attendance/myhistory");
        setRecords(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="page-center">
      <div className="card history-card">
        <h2>My Attendance History</h2>

        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours Worked</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="5">No attendance found</td>
              </tr>
            ) : (
              records.map((rec, index) => (
                <tr key={index}>
                  <td>{rec.date}</td>

                  {/* THIS IS THE FIX */}
                  <td>{formatTime(rec.checkInTime)}</td>
                  <td>{formatTime(rec.checkOutTime)}</td>

                  <td>
                    {rec.totalHours
                      ? `${rec.totalHours.toFixed(2)} hrs`
                      : "-"}
                  </td>

                  <td className={`status ${rec.status}`}>
                    {rec.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
