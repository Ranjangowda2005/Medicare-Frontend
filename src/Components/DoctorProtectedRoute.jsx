import { Navigate, Outlet } from "react-router-dom";

const DoctorProtectedRoute = () => {
  const doctorToken = localStorage.getItem("doctorToken");

  if (!doctorToken) {
    return <Navigate to="/doctor/login" replace />;
  }

  return <Outlet />;
};

export default DoctorProtectedRoute;