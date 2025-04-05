import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <TailSpin height={40} width={40} color="#2563eb" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
        <h2>📊 Dashboard</h2>
        <div style={cardStyle}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: "#f9f9f9",
  padding: "1rem",
  borderRadius: "6px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

export default DashboardPage;
