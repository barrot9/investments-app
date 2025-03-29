import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
//import axios from "axios";

const CreateListingPage = () => {
  useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    //   const res = await axios.post(
    //     "http://localhost:5000/api/listings",
    //     { title, description, price },
    //     { withCredentials: true }
    //   );

      setMessage("✅ Listing created successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
    } catch (err) {
      setMessage("❌ Failed to create listing");
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
        <h2>Create a New Listing</h2>

        {message && <p>{message}</p>}

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
            style={{
              padding: "0.75rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
