import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./EmployeePages.css";

export default function Profile(){

  const [user,setUser] = useState({});

  useEffect(()=>{
    const fetch=async()=>{
      const res = await api.get("/auth/me");
      setUser(res.data);
    };
    fetch();
  },[]);

  return(
    <div className="page-center">

      <div className="card profile-card">

        <h2>My Profile</h2>

        <div className="profile-row">
          <span>Name:</span>
          <p>{user.name}</p>
        </div>

        <div className="profile-row">
          <span>Email:</span>
          <p>{user.email}</p>
        </div>

        <div className="profile-row">
          <span>Employee ID:</span>
          <p>{user.employeeId}</p>
        </div>

        <div className="profile-row">
          <span>Department:</span>
          <p>{user.department}</p>
        </div>

      </div>

    </div>
  );
}
