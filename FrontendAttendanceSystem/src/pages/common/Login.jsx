import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../utils/api";
import "./Login.css";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role"); // employee or manager

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {

      const res = await API.post("/auth/login", {
        email,
        password
      });

      const user = res.data.user;

      // ROLE VALIDATION
      if (user.role !== selectedRole) {
        setError(`This account belongs to ${user.role}. Please use correct portal.`);
        return;
      }

      // Save session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));

      // Redirect based on role
      if (user.role === "manager") {
        navigate("/manager/dashboard");
      } else {
        navigate("/employee/attendance");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign In</button>

        {selectedRole === "employee" && (
          <p className="register-link">
            New Employee?{" "}
            <span onClick={() => navigate("/register")}>
              Register here
            </span>
          </p>
        )}

        <p className="back" onClick={() => navigate("/")}>
          ← Back to Home
        </p>

      </form>

    </div>
  );
}
