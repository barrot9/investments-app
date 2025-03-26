import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// ✅ Login function (uses HTTP-only cookies)
export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true } // Ensures cookies are sent
    );
    return response.data.message; // No token returned, stored in cookie
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// ✅ Logout function (clears cookie)
export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return "Logged out successfully";
  } catch (error) {
    throw error.response?.data?.message || "Logout failed";
  }
};

// ✅ Get User Info (Checks if token is valid)
export const getUser = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/auth/user", {
      withCredentials: true,
    });
    console.log("✅ getUser():", response.data); // 👈 Add this
    return response.data;
  } catch (error) {
    console.error("❌ getUser() failed:", error.response?.data || error.message);
    return null;
  }
};
