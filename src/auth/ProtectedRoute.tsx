import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, roles }: any) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

    if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;