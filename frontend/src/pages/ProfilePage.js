import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user, loading } = useContext(AuthContext);
  const [userListings, setUserListings] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/listings");
        const myListings = res.data.filter((listing) => listing.user_id === user.id);
        setUserListings(myListings);
      } catch (err) {
        console.error("Error fetching user listings:", err);
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchListings();
  }, [user]);

  if (loading || fetching) return <p>Loading profile...</p>;

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
        <h2>👤 Profile</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>

        <div style={{ marginTop: "2rem" }}>
          <h3>📦 Your Listings</h3>
          {userListings.length === 0 ? (
            <p>You haven't created any listings yet.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {userListings.map((item) => (
                <Link
                  key={item.id}
                  to={`/listing/${item.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid #ccc",
                    padding: "1rem",
                    width: "250px",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <p><strong>{item.price}</strong></p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
