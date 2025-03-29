import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const InboxPage = () => {
  useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/messages", {
          withCredentials: true,
        });
        setConversations(res.data);
      } catch (err) {
        console.error("❌ Error fetching inbox:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, []);

  if (loading) return <p>Loading inbox...</p>;

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
        <h2>💬 My Inbox</h2>

        {conversations.length === 0 ? (
          <p>No conversations yet.</p>
        ) : (
          conversations.map((conv) => (
            <Link
              to={`/messages/${conv.user_id}`}
              key={conv.user_id}
              style={{
                display: "block",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginBottom: "1rem",
                textDecoration: "none",
                color: "inherit",
                backgroundColor: "#f9f9f9",
              }}
            >
              <strong>{conv.username}</strong> ({conv.email})
              <p style={{ margin: "0.5rem 0", color: "#444" }}>
                {conv.last_message}
              </p>
              <small style={{ color: "#777" }}>
                {new Date(conv.created_at).toLocaleString()}
              </small>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default InboxPage;
