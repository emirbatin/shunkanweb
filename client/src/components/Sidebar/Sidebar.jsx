import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { capitalizeFirstLetter } from "../../utils/stringUtils";

const Sidebar = ({ userProfilePicture }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userPerm, setUserPerm] = useState("");
  const [userId, setUserId] = useState("");

  const userToken = sessionStorage.getItem("token") || localStorage.getItem("token");

  const formattedName = capitalizeFirstLetter(username);
  const formattedPerm = capitalizeFirstLetter(userPerm);

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
      setUserPerm(userData.role);
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-start justify-start text-left w-60 h-[90vh] pl-5">
      <div className="flex flex-row items-center justify-center box-border">
        <div className="flex flex-row items-center justify-center box-border">
          <img
            className="w-16 h-16 rounded-full object-cover mr-2"
            src={userProfilePicture || "https://cdn.pixabay.com/photo/2015/04/18/11/03/profile-728591_1280.jpg"}
            alt="user"
          />
          <div className="flex flex-col">
            <Typography variant="h5">{formattedName}</Typography>
            <Typography variant="h7" style={{ color: "var(--text-color)" }}>
              {formattedPerm}
            </Typography>
          </div>
        </div>
      </div>
      <br />
      <div className="flex-grow p-5">
        <ul>
          <li><Link className="route-link" to="/home">{t("home")}</Link></li>
          <br />
          <li><Link className="route-link" to="/courses">{t("courses")}</Link></li>
          <br />
          <li><Link className="route-link" to={`/profile/${userId}`}>{t("profile")}</Link></li>
          <br />
          <li><Link className="route-link" to={`/settings/${userId}`}>{t("settings")}</Link></li>
        </ul>
      </div>
      <div className="sidebar-logout">
        <Button
          className="logout-button"
          variant="contained"
          startIcon={<LogoutIcon style={{ color: "var(--icon-color)" }} />}
          onClick={handleLogout}
        >
          {t("logout")}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
