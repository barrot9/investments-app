import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useContext(AuthContext);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setPrice(res.data.price);
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        setError("Failed to load listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/listings/${id}`,
        { title, description, price },
        { withCredentials: true } // sends the JWT cookie
      );
      navigate(`/listing/${id}`);
    } catch (err) {
      console.error("Failed to update listing:", err);
      setError("Update failed. Make sure you're the owner.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!listing) return <p>Listing not found</p>;

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
        <h2>Edit Listing</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "0.5rem" }}
          />
          <textarea
            placeholder="Description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ padding: "0.5rem" }}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            required
            onChange={(e) => setPrice(e.target.value)}
            style={{ padding: "0.5rem" }}
          />

          <button
            type="submit"
            style={{
              padding: "0.75rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Update Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListingPage;
