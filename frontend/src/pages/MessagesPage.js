import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

const MessagesPage = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const defaultAvatar = "/default-avatar.jpg";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
          withCredentials: true,
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        toast.error("Failed to load messages.");
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };

    const fetchRecipient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setRecipient(res.data);
      } catch (err) {
        console.error("Error fetching recipient info:", err);
        toast.error("Failed to fetch recipient info.");
      }
    };

    fetchMessages();
    fetchRecipient();
  }, [userId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);

    try {
      await axios.post(
        `http://localhost:5000/api/messages`,
        { recipient_id: userId, content },
        { withCredentials: true }
      );
      setContent("");

      const res = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
        withCredentials: true,
      });
      setMessages(res.data);
      toast.success("Message sent!");
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
        <h2>Conversation with {recipient?.username || "User"}</h2>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <TailSpin height={40} width={40} color="#2563eb" />
          </div>
        ) : (
          <>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                height: "400px",
                overflowY: "auto",
                backgroundColor: "#f9f9f9",
              }}
            >
              {messages.map((msg) => {
                const isMe = msg.sender_id === user.id;
                const avatarPath = isMe ? user.avatar : recipient?.avatar;
                const avatarUrl = avatarPath
                  ? `http://localhost:5000${avatarPath}`
                  : defaultAvatar;
                const name = isMe ? "You" : recipient?.username || "User";

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: isMe ? "flex-end" : "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    {!isMe && (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          marginRight: "0.5rem",
                        }}
                      />
                    )}
                    <div
                      style={{
                        backgroundColor: isMe ? "#d1e7dd" : "#e2e3e5",
                        padding: "0.5rem 1rem",
                        borderRadius: "10px",
                        maxWidth: "70%",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {name}
                      </div>
                      <div>{msg.content}</div>
                      <div style={{ fontSize: "0.7rem", color: "#555", marginTop: "0.25rem" }}>
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                    {isMe && (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          marginLeft: "0.5rem",
                        }}
                      />
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}
            >
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, padding: "0.5rem" }}
              />
              <button
                type="submit"
                disabled={!content.trim() || sending}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default MessagesPage;
