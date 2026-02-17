import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import "./Register.css";

export default function Register(){

  const navigate = useNavigate();

  const [form,setForm]=useState({
    name:"",
    email:"",
    password:"",
    employeeId:"",
    department:""
  });

  const [message,setMessage]=useState("");
  const [type,setType]=useState("");

  const change=e=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const submit=async(e)=>{
    e.preventDefault();

    try{
      const res = await API.post("/auth/register",form);

      setType("success");
      setMessage("Details registered successfully! You can login now.");

      // clear form
      setForm({
        name:"",
        email:"",
        password:"",
        employeeId:"",
        department:""
      });

      // redirect after 2 seconds
      setTimeout(()=>{
        navigate("/login?role=employee");
      },2000);

    }catch(err){
      setType("error");
      setMessage(err.response?.data?.message || "User already exists");
    }
  };

  return(
    <div className="register-wrapper">

      <form className="register-card" onSubmit={submit}>
        <h2>Employee Registration</h2>

        {message && <p className={`msg ${type}`}>{message}</p>}

        <input name="name" placeholder="Full Name" value={form.name} onChange={change} required/>
        <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={change} required/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required/>
        <input name="employeeId" placeholder="Employee ID (EMP001)" value={form.employeeId} onChange={change} required/>
        <input name="department" placeholder="Department" value={form.department} onChange={change} required/>

        <button type="submit">Register</button>

        <p className="back" onClick={()=>navigate("/login?role=employee")}>
          ← Back to Login
        </p>
      </form>

    </div>
  );
}
