import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";

const InboxPage = () => {
  useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultAvatar = "/default-avatar.jpg";

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/messages", {
          withCredentials: true,
        });
        setConversations(res.data);
      } catch (err) {
        console.error("❌ Error fetching inbox:", err);
        toast.error("Failed to load inbox.");
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, []);

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
        <h2>💬 My Inbox</h2>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Oval height={40} width={40} color="#2563eb" />
            <p>Loading inbox...</p>
          </div>
        ) : conversations.length === 0 ? (
          <p>No conversations yet.</p>
        ) : (
          conversations.map((conv) => {
            const avatarUrl = conv.avatar
              ? `http://localhost:5000${conv.avatar.startsWith("/uploads/") ? conv.avatar : `/uploads/${conv.avatar}`}`
              : defaultAvatar;

            return (
              <Link
                to={`/messages/${conv.user_id}`}
                key={conv.user_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  marginBottom: "1rem",
                  textDecoration: "none",
                  color: "inherit",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
                <div>
                  <strong>{conv.username}</strong> ({conv.email})
                  <p style={{ margin: "0.5rem 0", color: "#444" }}>
                    {conv.last_message}
                  </p>
                  <small style={{ color: "#777" }}>
                    {new Date(conv.created_at).toLocaleString()}
                  </small>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InboxPage;
