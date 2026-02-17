import "./ManagerPages.css";
import api from "../../utils/api";
import { useEffect, useState } from "react";

export default function AllEmployees(){

  const [data,setData] = useState([]);

  useEffect(()=>{
    const fetch = async()=>{
      try{
        const res = await api.get("/attendance/all");
        setData(res.data);
      }catch(err){
        console.log(err);
      }
    };
    fetch();
  },[]);

  return(
    <div className="manager-page">

      <h2 className="manager-title">All Employees Attendance</h2>

      <div className="manager-card">

        <div className="table-wrapper">

          <table className="attendance-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((emp,i)=>(
                <tr key={i}>
                  <td>{emp.userId?.name}</td>
                  <td>{emp.userId?.employeeId}</td>
                  <td>{emp.date}</td>
                  <td>
                    {emp.checkInTime
                      ? new Date(emp.checkInTime).toLocaleTimeString("en-IN")
                      : "-"}
                  </td>

                  <td>
                    {emp.checkOutTime
                      ? new Date(emp.checkOutTime).toLocaleTimeString("en-IN")
                      : "-"}
                  </td>

                  <td>
                    <span className={`status-badge ${emp.status}`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}
