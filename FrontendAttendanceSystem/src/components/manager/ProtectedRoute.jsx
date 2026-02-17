import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // not logged in
  if(!token){
    return <Navigate to="/" />;
  }

  // wrong role trying to access
  if(role && role !== userRole){
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
