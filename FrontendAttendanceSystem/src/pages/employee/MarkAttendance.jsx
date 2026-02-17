import { useState } from "react";
import "./EmployeePages.css";
import api from "../../utils/api";

export default function MarkAttendance(){

  const [message,setMessage] = useState("");

  const checkIn = async () => {
    try{
      const res = await api.post("/attendance/checkin");
      setMessage(res.data.message);
    }catch(err){
      setMessage(err.response?.data?.message || "Error");
    }
  };

  const checkOut = async () => {
    try{
      const res = await api.post("/attendance/checkout");
      setMessage(res.data.message);
    }catch(err){
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return(
    <div className="page-center">

      <div className="card attendance-card">
        <h1>Mark Attendance</h1>

        <div className="btn-group">
          <button className="primary-btn" onClick={checkIn}>
            Check In
          </button>

          <button className="secondary-btn" onClick={checkOut}>
            Check Out
          </button>
        </div>

        {message && <p className="status">{message}</p>}
      </div>

    </div>
  );
}
