import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../utils/api";
import "./Login.css";

export default function Login(){

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role"); // employee OR manager

  const login = async(e)=>{
    e.preventDefault();
    setError("");

    try{
      const res = await API.post("/auth/login",{email,password});

      // 🔴 ROLE VALIDATION (MOST IMPORTANT)
      if(res.data.user.role !== selectedRole){
        setError(`This account belongs to ${res.data.user.role}. Please use correct portal.`);
        return;
      }

      // store session
      localStorage.setItem("token",res.data.token);
      localStorage.setItem("role",res.data.user.role);
      localStorage.setItem("user",JSON.stringify(res.data.user));

      // redirect
      if(res.data.user.role==="manager")
        navigate("/manager/dashboard");
      else
        navigate("/employee/attendance");

    }catch(err){
      setError("Invalid email or password");
    }
  };

  return(
    <div className="login-wrapper">

      <form className="login-card" onSubmit={login}>
        <h1 className="logo">WorkTrack</h1>

        <h3 className="portal-title">
          {selectedRole === "manager" ? "Manager Portal" : "Employee Portal"}
        </h3>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email address"
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign In</button>

        {/* Show register only for employee */}
        {selectedRole === "employee" && (
          <p className="register-link">
            New Employee?{" "}
            <span onClick={() => navigate("/register")}>
              Register here
            </span>
          </p>
        )}

        <p className="back" onClick={()=>navigate("/")}>
          ← Back to Home
        </p>
      </form>

    </div>
  );
}
