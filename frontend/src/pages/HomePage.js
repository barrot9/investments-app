import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";

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
        toast.error("Failed to load listings");
      } finally {
        setFetching(false);
      }
    };

    fetchListings();
  }, []);

  if (loading || fetching) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Oval height={40} width={40} color="#2563eb" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
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
              listings.map((item) => {
                const avatarUrl = item.avatar
                  ? `http://localhost:5000${item.avatar.startsWith("/uploads/") ? item.avatar : `/uploads/${item.avatar}`}`
                  : "/default-avatar.jpg";

                return (
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        <img
                          src={avatarUrl}
                          alt="Seller Avatar"
                          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                        />
                        <span style={{ fontSize: "0.85rem", color: "#666" }}>{item.email}</span>
                      </div>
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
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
