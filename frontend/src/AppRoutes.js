import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import CreateListingPage from "./pages/CreateListingPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import EditListingPage from "./pages/EditListingPage";
import MessagesPage from "./pages/MessagesPage";
import InboxPage from "./pages/InboxPage";
import ProfilePage from "./pages/ProfilePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes with shared Layout */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateListingPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/listing/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ListingDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/listing/:id/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <EditListingPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages/:userId"
        element={
          <ProtectedRoute>
            <Layout>
              <MessagesPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <Layout>
              <InboxPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
