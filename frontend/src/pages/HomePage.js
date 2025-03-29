import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user, loading } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/listings");
        setListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchListings();
  }, []);

  if (loading || fetching) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h2>Welcome to the Marketplace, {user?.username}!</h2>

        <div style={{ marginTop: "2rem" }}>
          <h3>📦 Recent Listings</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {listings.length === 0 ? (
              <p>No listings yet</p>
            ) : (
              listings.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "1rem",
                    width: "250px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    textAlign: "left",
                    backgroundColor: "#fff",
                    transition: "transform 0.2s",
                  }}
                >
                  <Link
                    to={`/listing/${item.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h4>{item.title}</h4>
                    <p style={{ margin: "0.5rem 0" }}>{item.description}</p>
                    <p style={{ fontWeight: "bold" }}>{item.price}</p>
                    <p style={{ fontSize: "0.85rem", color: "#666" }}>
                      Seller: {item.email}
                    </p>
                  </Link>

                  {item.user_id !== user.id && (
                    <Link to={`/messages/${item.user_id}`}>
                      <button
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.5rem 1rem",
                          backgroundColor: "#6366f1",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        💬 Message Seller
                      </button>
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
