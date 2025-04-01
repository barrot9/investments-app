import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setFormData({ username: user.username, email: user.email, password: "" });

      try {
        const listingsRes = await axios.get("http://localhost:5000/api/listings", {
          withCredentials: true,
        });
        const myListings = listingsRes.data.filter((listing) => listing.user_id === user.id);
        setListings(myListings);

        const convoRes = await axios.get("http://localhost:5000/api/messages", {
          withCredentials: true,
        });
        setConversations(convoRes.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchData();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      if (formData.password) data.append("password", formData.password);
      if (avatarFile) data.append("avatar", avatarFile);

      await axios.put("http://localhost:5000/api/auth/user", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      await refreshUser();
      setEditMode(false);
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
        <h2>👤 Profile</h2>

        {/* USER INFO */}
        <section style={sectionStyle}>
          <h3>👥 Account Info</h3>
          {!editMode ? (
            <>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button onClick={() => setEditMode(true)} style={buttonStyle}>Edit Profile</button>
            </>
          ) : (
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                value={formData.username}
                placeholder="Username"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <input
                type="email"
                value={formData.email}
                placeholder="Email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="password"
                value={formData.password}
                placeholder="New Password (optional)"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <label>
                Upload Avatar:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
              </label>
              <button type="submit" style={buttonStyle}>Save Changes</button>
              <button type="button" onClick={() => setEditMode(false)} style={cancelButtonStyle}>Cancel</button>
            </form>
          )}
        </section>

        {/* MY LISTINGS */}
        <section style={sectionStyle}>
          <h3>📦 My Listings</h3>
          {listings.length === 0 ? (
            <p>No listings yet.</p>
          ) : (
            listings.map((item) => (
              <div key={item.id} style={cardStyle}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <p><strong>Price:</strong> {item.price}</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link to={`/edit/${item.id}`} style={linkBtnStyle}>Edit</Link>
                  <Link to={`/listing/${item.id}`} style={linkBtnStyle}>View</Link>
                </div>
              </div>
            ))
          )}
        </section>

        {/* MY CONVERSATIONS */}
        <section style={sectionStyle}>
          <h3>💬 My Conversations</h3>
          {conversations.length === 0 ? (
            <p>No conversations yet.</p>
          ) : (
            conversations.map((c) => (
              <div key={c.user_id} style={cardStyle}>
                <p><strong>{c.username}</strong> ({c.email})</p>
                <p><em>{c.last_message}</em></p>
                <Link to={`/messages/${c.user_id}`} style={linkBtnStyle}>View Conversation</Link>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

const sectionStyle = {
  borderBottom: "1px solid #ccc",
  paddingBottom: "1.5rem",
  marginBottom: "1.5rem",
};

const cardStyle = {
  backgroundColor: "#f9f9f9",
  padding: "1rem",
  borderRadius: "6px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  marginBottom: "1rem",
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#9ca3af",
};

const linkBtnStyle = {
  ...buttonStyle,
  textDecoration: "none",
  fontSize: "0.9rem",
};

export default ProfilePage;
