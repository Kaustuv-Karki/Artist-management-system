import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.user);
  console.log("This is user", user);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
