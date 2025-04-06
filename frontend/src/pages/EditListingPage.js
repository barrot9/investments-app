import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useContext(AuthContext);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        toast.error("Failed to load listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await axios.put(
        `http://localhost:5000/api/listings/${id}`,
        { title, description, price },
        { withCredentials: true }
      );
      toast.success("Listing updated successfully!");
      setTimeout(() => navigate(`/listing/${id}`), 1500);
    } catch (err) {
      console.error("Failed to update listing:", err);
      toast.error("Update failed. Make sure you're the owner.");
      setError("Update failed. Make sure you're the owner.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
        <h2>Edit Listing</h2>

        {/* 🔴 Show error if exists */}
        {error && (
          <p style={{ color: "red", marginTop: "0.5rem", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <TailSpin height={40} width={40} color="#2563eb" />
          </div>
        ) : listing ? (
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
              disabled={submitting}
              style={{
                padding: "0.75rem",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              {submitting ? <TailSpin height={18} width={18} color="#fff" /> : "Update Listing"}
            </button>
          </form>
        ) : (
          <p>Listing not found</p>
        )}
      </div>
    </div>
  );
};

export default EditListingPage;
