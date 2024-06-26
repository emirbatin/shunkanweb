import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CourseDetails from "../components/Courses/CourseDetails.jsx";
import { useCoursesContext } from "../hooks/useCoursesContext.jsx";
import { jwtDecode } from "jwt-decode"; // Doğru kullanım bu şekildedir
import { Typography } from "@mui/material";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import LottieAnimation from "../components/LootieAnimation/lootieAnimation.jsx";
import LoadingLootie from "../assets/lottie/Manwithglassessittingonmonitorandlookingup.json";
import { fetchUserDetails, fetchAllCourses } from "../api"; // API çağrılarını içe aktarın

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
  const { t } = useTranslation();

  useEffect(() => {
    if (userToken) {
      const data = jwtDecode(userToken);
      setUserId(data.id);
      getUserDetails(data.id);
    }
  }, [userToken]);

  const getUserDetails = async (userId) => {
    try {
      const userData = await fetchUserDetails(userId);
      setUsername(userData.username);
      setUserProfilePicture(userData.imageUrl);
      setUserPerm(userData.role);
      setLoading(false);
    } catch (error) {
      console.error(t("Error fetching user details:"), error);
      navigate("/login");
    }
  };

  const { courses, dispatch } = useCoursesContext();
  const formattedName = capitalizeFirstLetter(username);
  const formattedPerm = capitalizeFirstLetter(userPerm);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const coursesData = await fetchAllCourses();
        dispatch({ type: "SET_COURSES", payload: coursesData });
      } catch (error) {
        console.error(t("Error fetching courses:"), error);
      }
    };

    getCourses();
  }, [dispatch, t]);

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
