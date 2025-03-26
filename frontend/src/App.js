import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <Router>
      <AuthProvider> {/* ✅ Now wraps everything including Routes */}
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
