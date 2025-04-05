import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

const CreateListingPage = () => {
  useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        "http://localhost:5000/api/listings",
        { title, description, price },
        { withCredentials: true }
      );

      toast.success("✅ Listing created successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
    } catch (err) {
      toast.error("❌ Failed to create listing");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
        <h2>Create a New Listing</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: "0.5rem" }}
          >
            <option value="">Select a title</option>
            <option value="בקשה להלוואה">בקשה להלוואה</option>
            <option value="רוצה להלוות">רוצה להלוות</option>
          </select>

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
            {submitting ? <TailSpin height={18} width={18} color="#fff" /> : "Create Listing"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateListingPage;
