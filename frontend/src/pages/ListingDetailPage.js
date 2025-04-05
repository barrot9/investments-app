import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultAvatar = "/default-avatar.jpg";

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Error fetching listing:", err);
        toast.error("Failed to load listing.");
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
      toast.success("Listing deleted successfully.");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      console.error("Error deleting listing:", err);
      toast.error("Failed to delete listing.");
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
            <TailSpin height={50} width={50} color="#2563eb" />
          </div>
        ) : listing ? (
          <>
            <h2 style={{ marginBottom: "1rem" }}>{listing.title}</h2>
            <p><strong>Description:</strong> {listing.description}</p>
            <p><strong>Price:</strong> {listing.price}</p>
            <p><strong>Created At:</strong> {new Date(listing.created_at).toLocaleString()}</p>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1rem 0" }}>
              <img
                src={
                  listing.avatar
                    ? `http://localhost:5000${listing.avatar.startsWith("/uploads/") ? listing.avatar : `/uploads/${listing.avatar}`}`
                    : defaultAvatar
                }
                alt="Seller Avatar"
                style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <p><strong>Seller:</strong> {listing.email}</p>
              </div>
            </div>

            {user?.id === listing.user_id && (
              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                <button onClick={() => navigate(`/listing/${listing.id}/edit`)} style={editBtnStyle}>
                  ✏️ Edit
                </button>
                <button onClick={handleDelete} style={deleteBtnStyle}>
                  🗑️ Delete
                </button>
              </div>
            )}
          </>
        ) : (
          <p>Listing not found.</p>
        )}
      </div>
    </div>
  );
};

const editBtnStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const deleteBtnStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default ListingDetailPage;
