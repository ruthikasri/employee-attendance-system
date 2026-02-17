import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./EmployeePages.css";

export default function MonthlySummary(){

  const [data,setData] = useState({});

  useEffect(()=>{
    const fetch = async()=>{
      const res = await api.get("/attendance/my-monthly-summary")
      setData(res.data);
    };
    fetch();
  },[]);

  return(
    <div className="page-center">
      <div className="card">

        <h2>Monthly Summary</h2>

        <div className="summary-grid">
          <div className="summary-box present">
            <h3>{data.presentDays || 0}</h3>
            <p>Present Days</p>
          </div>

          <div className="summary-box late">
            <h3>{data.lateDays || 0}</h3>
            <p>Late Days</p>
          </div>

          <div className="summary-box half">
            <h3>{data.halfDays || 0}</h3>
            <p>Half Days</p>
          </div>

          <div className="summary-box hours">
            <h3>{data.totalHours || 0} hrs</h3>
            <p>Total Hours</p>
          </div>
        </div>

      </div>
    </div>
  );
}
