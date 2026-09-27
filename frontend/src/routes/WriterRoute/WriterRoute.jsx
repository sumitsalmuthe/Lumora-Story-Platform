import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../context/AuthContext/useAuth";

function WriterRoute() {
  const { isAuthenticated, isWriter } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isWriter) {
    return <Navigate to="/become-writer" replace />;
  }

  return <Outlet />;
}

export default WriterRoute;
