import React, { useEffect, useState } from "react"; // useState'i import edin
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import CourseDetails from "../components/Courses/CourseDetails.jsx";

import { useCoursesContext } from "../hooks/useCoursesContext.jsx";
import { jwtDecode } from "jwt-decode"; // Doğru import şekli
import { Typography } from "@mui/material";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import Sidebar from "../components/Sidebar/Sidebar.jsx";

const SelectCoursePage = () => {
  const userToken =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  const [username, setUsername] = useState(""); // useState kullanarak username durumunu yönetin
  const [userPerm, setUserPerm] = useState("");
  const [userId, setUserId] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");


  useEffect(() => {
    console.log("Token:", userToken);

    // Eğer kullanıcı token'ı varsa, bu token'ı decode edin ve kullanıcı bilgilerini çekin
    if (userToken) {
      const data = jwtDecode(userToken);
      // Kullanıcı detaylarını çekmek için ayrı bir useEffect içinde API çağrısı yapın
      fetchUserDetails(data.id);
    }
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      const data = jwtDecode(userToken);
      setUserId(data.id); // Decode edilen token'dan elde edilen ID'yi state'e kaydet
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
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
      // Hata durumunda da kullanıcıyı login sayfasına yönlendir
      navigate("/login");
    }
  };

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { courses, dispatch } = useCoursesContext();
  const formattedName = capitalizeFirstLetter(username);
  const formattedPerm = capitalizeFirstLetter(userPerm);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (!res.ok) {
        console.error(`Server responded with status code ${res.status}`);
        return;
      }
      dispatch({ type: "SET_COURSES", payload: data });
    };

    fetchCourses();
  }, []);

  // Rotalama işlevini tetiklemek için kullanılacak yöntem
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div>
      {/* Courses Container */}
      <div className="flex w-auto h-full justify-start items-start flex-row">
        {/* Left Sidebar Container */}
          <Sidebar></Sidebar>

        {/* Right Container */}
        <div class="grid grid-cols-4 gap-1 items-start flex-grow p-5">
          {courses &&
            courses.map((course) => (
              <div key={course._id} className="w-full p-2">
                <CourseDetails course={course} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCoursePage;
