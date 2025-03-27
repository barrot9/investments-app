import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const dummyListings = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    description: "128GB, Graphite. Like new.",
    price: "$750",
    seller: "techguru@example.com",
  },
  {
    id: 2,
    title: "Mountain Bike",
    description: "Giant Talon 2, barely used.",
    price: "$450",
    seller: "adventure123@example.com",
  },
  {
    id: 3,
    title: "Gaming Laptop",
    description: "RTX 3060, 16GB RAM, 1TB SSD.",
    price: "$1200",
    seller: "gamerzone@example.com",
  },
];

const HomePage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto", // ✅ horizontally center
          padding: "2rem",
          textAlign: "center", // ✅ center text
        }}
      >
        <h2>Welcome to the Marketplace, {user?.username}!</h2>

        <div style={{ marginTop: "2rem" }}>
          <h3>📦 Featured Listings</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center", // ✅ center listings
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {dummyListings.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  width: "250px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  textAlign: "left", // ✅ keep cards readable
                  backgroundColor: "#fff",
                }}
              >
                <h4>{item.title}</h4>
                <p style={{ margin: "0.5rem 0" }}>{item.description}</p>
                <p style={{ fontWeight: "bold" }}>{item.price}</p>
                <p style={{ fontSize: "0.85rem", color: "#666" }}>Seller: {item.seller}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
