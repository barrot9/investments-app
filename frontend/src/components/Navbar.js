import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav
      style={{
        backgroundColor: "#1f2937",
        color: "white",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div>
        <NavLink to="/home" style={navStyle}>
          🏠 Home
        </NavLink>
        <NavLink to="/create" style={navStyle}>
          ➕ Create Listing
        </NavLink>
        {user && (
          <>
            <NavLink to="/inbox" style={navStyle}>
              💬 My Messages
            </NavLink>
            <NavLink to="/dashboard" style={navStyle}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/profile" style={navStyle}>
              👤 My Profile
            </NavLink>
          </>
        )}
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.9rem", color: "#ddd" }}>{user.email}</span>
          <button onClick={logoutUser} style={logoutButtonStyle}>
            🔓 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const navStyle = ({ isActive }) => ({
  color: isActive ? "#60a5fa" : "white", // blue-400 if active
  textDecoration: "none",
  marginRight: "1rem",
  fontWeight: isActive ? "bold" : "normal",
  borderBottom: isActive ? "2px solid #60a5fa" : "none",
});

const logoutButtonStyle = {
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  cursor: "pointer",
  borderRadius: "4px",
};

export default Navbar;
