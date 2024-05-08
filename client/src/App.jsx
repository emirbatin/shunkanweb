import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CustomAppBar from "./components/Header/Header.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import SelectCoursePage from "./pages/SelectCoursePage.jsx";
import CourseContentPage from "./pages/CourseContentPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import UserSettingsPage from "./pages/UserSettingsPage.jsx";
import { UserProvider } from "./context/UserContext.jsx";

function App() {
  return (
    <UserProvider>
    <Router>
      <div>
        <CustomAppBar showIconButton={false} showThemeButton={true} />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/createAccount" element={<CreateAccountPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/editprofile/:userId" element={<EditProfilePage />} />
          <Route path="/courses" element={<SelectCoursePage />} />
          <Route path="/course/:courseId" element={<CourseContentPage />} />
          <Route path="/settings/:userId" element={<UserSettingsPage />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;
