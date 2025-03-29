import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Error fetching listing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/listings/${id}`, {
        withCredentials: true,
      });
      navigate("/home");
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!listing) return <p>Listing not found</p>;

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem" }}>
        <h2>{listing.title}</h2>
        <p><strong>Description:</strong> {listing.description}</p>
        <p><strong>Price:</strong> {listing.price}</p>
        <p><strong>Seller:</strong> {listing.email}</p>
        <p><strong>Created At:</strong> {new Date(listing.created_at).toLocaleString()}</p>

        {/* ✅ Show edit/delete buttons only for owner */}
        {user?.id === listing.user_id && (
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button
              onClick={() => navigate(`/listing/${listing.id}/edit`)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ✏️ Edit
            </button>

            <button
              onClick={handleDelete}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetailPage;
