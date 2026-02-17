import { useState } from "react";
import api from "../../utils/api";
import "./ManagerPages.css";

export default function FilterAttendance() {

  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    try {
      const res = await api.get(`/attendance/filter?date=${date}`);
      setRecords(res.data);
      setSearched(true);
    } catch (err) {
      console.log(err);
      setRecords([]);
      setSearched(true);
    }
  };

  return (
  <div className="page-center">
    <div className="card">

      <h1>Filter Attendance By Date</h1>

      <div className="filter-box">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button className="primary-btn" onClick={search}>Search</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.userId.name}</td>
                <td>{r.userId.employeeId}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
);

}
