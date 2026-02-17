import { useEffect, useState } from "react";
import API from "../../utils/api";
import "./EmployeePages.css";

export default function MarkAttendance() {

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  // 🔹 Fetch today's attendance status
  const loadStatus = async () => {
    try {
      const res = await API.get("/attendance/status");
      setStatus(res.data.status);
    } catch {
      setStatus("not-checked-in");
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  // 🔹 CHECK IN
  const checkIn = async () => {
    try {
      const res = await API.post("/attendance/checkin");
      setMessage(res.data.message);
      loadStatus(); // refresh button state
    } catch (err) {
      setMessage(err.response?.data?.message || "Check-in failed");
    }
  };

  // 🔹 CHECK OUT
  const checkOut = async () => {
    try {
      const res = await API.post("/attendance/checkout");
      setMessage(res.data.message);
      loadStatus(); // refresh button state
    } catch (err) {
      setMessage(err.response?.data?.message || "Check-out failed");
    }
  };

  return (
    <div className="page-center">
      <div className="card">

        <h2>Mark Attendance</h2>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>

          {/* CHECK IN BUTTON */}
          <button
            className="btn-blue"
            onClick={checkIn}
            disabled={status !== "not-checked-in"}
          >
            Check In
          </button>

          {/* CHECK OUT BUTTON */}
          <button
            className="btn-green"
            onClick={checkOut}
            disabled={status !== "checked-in"}
          >
            Check Out
          </button>

        </div>

        <p style={{ marginTop: "20px", fontWeight: "500" }}>
          {status === "not-checked-in" && "You haven't checked in today"}
          {status === "checked-in" && "You are checked in. Don't forget to check out!"}
          {status === "completed" && "You have completed today's attendance"}
        </p>

        {message && (
          <p style={{ color: "#ef4444", marginTop: "10px" }}>{message}</p>
        )}

      </div>
    </div>
  );
}
