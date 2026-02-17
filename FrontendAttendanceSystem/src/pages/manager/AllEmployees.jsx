import { useEffect,useState } from "react";
import API from "../../utils/api";

export default function AllEmployees(){

  const [records,setRecords]=useState([]);

  useEffect(()=>{
    API.get("/attendance/all")
    .then(res=>setRecords(res.data))
    .catch(err=>console.log(err));
  },[]);

  return(
    <div style={{padding:"30px"}}>
      <h2>All Employees Attendance</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Date</th>
            <th>CheckIn</th>
            <th>CheckOut</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map(r=>(
            <tr key={r._id}>
              <td>{r.userId?.name}</td>
              <td>{r.userId?.employeeId}</td>
              <td>{r.date}</td>
              <td>{r.checkInTime?.slice(11,19)}</td>
              <td>{r.checkOutTime?.slice(11,19)}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
