import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AdminRoute component
 * Protects admin routes - only accessible by users with admin role
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F4F6F8" }}
      >
        <span
          className="loading loading-spinner loading-lg"
          style={{ color: "#00529B" }}
        ></span>
      </div>
    );
  }

  // Check if user is logged in and has admin role
  if (!user) {
    // Redirect to login with return URL
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  if (user.role !== "admin") {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
