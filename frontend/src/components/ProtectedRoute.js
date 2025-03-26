import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading state until user is fetched
  if (loading) return <p>Loading...</p>;

  // If not authenticated, redirect to login and remember where user tried to go
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated, render protected content
  return children;
};

export default ProtectedRoute;
