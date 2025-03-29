import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        backgroundColor: "#282c34",
        color: "white",
      }}
    >
      {/* App title */}
      <div>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
          🛍️ MyApp
        </Link>
      </div>

      {/* Navigation actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {user && (
          <>
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
              Home
            </Link>

            {/* ✅ New Create Listing link */}
            <Link to="/create" style={{ color: "white", textDecoration: "none" }}>
              + Create Listing
            </Link>

            <span>{user.email}</span>

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
