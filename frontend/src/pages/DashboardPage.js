import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const DashboardPage = () => {
  const { user, logoutUser, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {user?.username}!</h2>
      <p>Email: {user?.email}</p>
      <p>User ID: {user?.id}</p>

      <button
        onClick={logoutUser}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        🔓 Logout
      </button>
    </div>
  );
};

export default DashboardPage;
