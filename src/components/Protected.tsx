import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";

const Protected = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  return <Outlet />;
};

const getUserByRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decodedToken: { role: string } = jwtDecode(token);
    return decodedToken.role;
  } catch (error) {
    console.error(error);
    localStorage.removeItem("token");
    return null;
  }
};

const AdminRoute = () => {
  const role = getUserByRole();
  return role === "admin" ? <Outlet /> : <Navigate to="/home" replace />;
};

const MemberRoute = () => {
  const role = getUserByRole();
  return role === "member" ? <Outlet /> : <Navigate to="/admin" replace />;
};

export { AdminRoute, MemberRoute, Protected };
