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
                <Link
                  to={`/listing/${item.id}`}
                  key={item.id}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
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
                    <h4>{item.title}</h4>
                    <p style={{ margin: "0.5rem 0" }}>{item.description}</p>
                    <p style={{ fontWeight: "bold" }}>{item.price}</p>
                    <p style={{ fontSize: "0.85rem", color: "#666" }}>
                      Seller: {item.email}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
