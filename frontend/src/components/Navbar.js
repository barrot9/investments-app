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
            <img
            src={user?.avatar ? `http://localhost:5000${user.avatar}` : "/default-avatar.jpg"}
            alt="avatar"
            style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
            }}
            />
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
    color: isActive ? "#1f2937" : "white",
    backgroundColor: isActive ? "#e5e7eb" : "transparent", // gray-200 for active
    textDecoration: "none",
    marginRight: "1rem",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    border: isActive ? "2px solid #60a5fa" : "2px solid transparent", // blue border if active
    fontWeight: isActive ? "bold" : "normal",
    transition: "all 0.2s ease-in-out",
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
