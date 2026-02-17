import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const location = useLocation();

  // Not logged in
  if (!token) {
    return <Navigate to={`/login?role=${role}`} state={{ from: location }} replace />;
  }

  // Wrong portal access
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
