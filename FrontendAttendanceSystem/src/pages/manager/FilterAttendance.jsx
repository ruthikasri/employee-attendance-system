import { useState } from "react";
import API from "../../utils/api";

export default function FilterAttendance(){

  const [date,setDate]=useState("");
  const [records,setRecords]=useState([]);

  const search=async()=>{
    const res=await api.get(`/attendance/filter?date=${selectedDate}`);
    setRecords(res.data);
  };

  return(
    <div style={{padding:"30px"}}>
      <h2>Filter Attendance By Date</h2>

      <input
        type="date"
        onChange={e=>setDate(e.target.value)}
      />

      <button onClick={search}>Search</button>

      <table border="1" style={{marginTop:"20px"}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map(r=>(
            <tr key={r._id}>
              <td>{r.userId?.name}</td>
              <td>{r.userId?.employeeId}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
