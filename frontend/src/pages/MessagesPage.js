import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";

const MessagesPage = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams(); // The user we're chatting with

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
        withCredentials: true,
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/messages`,
        { recipient_id: userId, content },
        { withCredentials: true }
      );
      setContent("");
      fetchMessages(); // refresh messages
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
        <h2>Messages</h2>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            height: "400px",
            overflowY: "auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                textAlign: msg.sender_id === user.id ? "right" : "left",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1rem",
                  backgroundColor: msg.sender_id === user.id ? "#d1e7dd" : "#e2e3e5",
                  borderRadius: "10px",
                }}
              >
                {msg.content}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: "0.5rem" }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagesPage;
