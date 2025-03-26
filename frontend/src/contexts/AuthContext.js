import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch user from server
  const refreshUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false); // ✅ Fix: Stop loading after user check
    }
  };

  // ✅ Fetch on load
  useEffect(() => {
    refreshUser();
  }, []);

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logoutUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
