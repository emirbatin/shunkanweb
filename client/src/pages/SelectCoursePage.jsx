import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CourseDetails from "../components/Courses/CourseDetails.jsx";
import { useCoursesContext } from "../hooks/useCoursesContext.jsx";
import { jwtDecode } from "jwt-decode";
import { Typography } from "@mui/material";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import LottieAnimation from "../components/LootieAnimation/lootieAnimation.jsx";
import LoadingLootie from "../assets/lottie/Manwithglassessittingonmonitorandlookingup.json";

const SelectCoursePage = () => {
  const userToken =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [userPerm, setUserPerm] = useState("");
  const [userId, setUserId] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      const data = jwtDecode(userToken);
      setUserId(data.id);
      fetchUserDetails(data.id);
    }
  }, [userToken]);

  const fetchUserDetails = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const userData = await res.json();

      if (!res.ok) {
        throw new Error(userData.error || "Bir hata oluştu");
      }

      setUsername(userData.username);
      setUserProfilePicture(userData.imageUrl);
      setUserPerm(userData.role);
      setLoading(false);
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
      navigate("/login");
    }
  };

  const { t } = useTranslation();
  const { courses, dispatch } = useCoursesContext();
  const formattedName = capitalizeFirstLetter(username);
  const formattedPerm = capitalizeFirstLetter(userPerm);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(`Server responded with status code ${res.status}`);
        }

        dispatch({ type: "SET_COURSES", payload: data });
      } catch (error) {
        console.error("Dersler alınamadı:", error);
      }
    };

    fetchCourses();
  }, [dispatch]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Sidebar Toggle Button for Small Screens */}
      <div className="md:hidden flex justify-center p-2">
        <Button variant="text" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </Button>
      </div>

      {/* Left Sidebar Container */}
      <div
        className={`md:block transition-transform duration-300 ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} />
      </div>

      {/* Right Container */}
      <div className="flex-grow p-5 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-h-screen overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="flex flex-col text-center items-center justify-center h-screen w-auto">
              <div className="flex w-80 h-auto pb-40">
                <LottieAnimation animationData={LoadingLootie} />
              </div>
            </div>
          ) : (
            courses &&
            [...courses].reverse().map((course) => (
              <div key={course._id} className="w-full p-2">
                <CourseDetails course={course} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectCoursePage;
