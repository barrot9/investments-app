import { useContext } from "react";
import { Link } from "react-router-dom";
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
      }}
    >
      <div>
        <Link to="/home" style={linkStyle}>
          🏠 Home
        </Link>
        <Link to="/create" style={linkStyle}>
          ➕ Create Listing
        </Link>
        {user && (
          <>
            <Link to={`/messages/${user.id}`} style={linkStyle}>
              💬 My Messages
            </Link>
            <Link to="/dashboard" style={linkStyle}>
              📊 Dashboard
            </Link>
          </>
        )}
      </div>

      {user && (
        <button onClick={logoutUser} style={logoutButtonStyle}>
          🔓 Logout
        </button>
      )}
    </nav>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginRight: "1rem",
};

const logoutButtonStyle = {
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  cursor: "pointer",
  borderRadius: "4px",
};

export default Navbar;
