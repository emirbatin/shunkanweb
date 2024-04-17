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

function App() {
  return (
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
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
