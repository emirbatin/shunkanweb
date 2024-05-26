import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import CustomAppBar from "./components/Header/Header.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import SelectCoursePage from "./pages/SelectCoursePage.jsx";
import CourseContentPage from "./pages/CourseContentPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import UserSettingsPage from "./pages/UserSettingsPage.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ShuwaPage from "./pages/ShuwaPage.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("/api/auth/validate-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.valid && !data.banned) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
          }
        } catch (err) {
          console.error(err);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    validateToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserProvider>
      <Router>
        <div>
          <CustomAppBar showIconButton={false} showThemeButton={true} />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/createAccount" element={<CreateAccountPage />} />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/editprofile/:userId"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <EditProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <SelectCoursePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <CourseContentPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings/:userId"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <UserSettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <AdminPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/shuwa"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <ShuwaPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
