import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const DashboardPage = () => {
  const { user, loading } = useContext(AuthContext); // logoutUser

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <h2>Welcome, {user?.username}!</h2>
      <p>Email: {user?.email}</p>
      <p>User ID: {user?.id}</p>
    </div>
  );
};

export default DashboardPage;
