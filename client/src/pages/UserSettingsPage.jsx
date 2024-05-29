import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Doğru kullanım bu şekildedir
import Sidebar from "../components/Sidebar/Sidebar";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { fetchUserDetails, updateUserDetails } from "../api"; // API çağrılarını içe aktarın

const UserSettingsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const userToken = sessionStorage.getItem("token") || localStorage.getItem("token");

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);

  useEffect(() => {
    if (userToken) {
      const data = jwtDecode(userToken);
      getUserDetails(data.id);
    }
  }, [userToken]);

  const getUserDetails = async (id) => {
    try {
      const data = await fetchUserDetails(id);
      setUserData({ username: data.username, email: data.email, password: "" });
    } catch (error) {
      console.error(t("Error fetching user details:"), error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const handleBannerImageChange = (e) => {
    setBannerImageFile(e.target.files[0]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (profileImageFile) formData.append("image", profileImageFile);
    if (bannerImageFile) formData.append("banner", bannerImageFile);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    if (userData.password) formData.append("password", userData.password);

    try {
      const data = await updateUserDetails(userId, formData);
      console.log(t("User details updated:"), data);
      // Optionally, navigate to a different page or show a success message
    } catch (error) {
      console.error(t("Error updating user details:"), error);
    }
  };

  return (
    <div className="flex flex-row">
      <div className="flex">
        <Sidebar />
      </div>
      <div className="flex flex-grow flex-col justify-start items-start text-start w-screen h-screen">
        <Typography variant="h4">{t("settings")}</Typography>
        <div className="flex flex-col w-screen h-screen">
          <br />
          <Typography variant="h6">{t("username")}</Typography>
          <input
            className="p-3 w-80 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
            style={{ backgroundColor: "var(--input-area-bg-color)" }}
            type="text"
            id="changeUsernameInput"
            name="username"
            autoComplete="username"
            placeholder={t("username")}
            value={userData.username}
            onChange={handleChange}
          />
          <br />
          <Typography variant="h6">{t("email")}</Typography>
          <input
            className="p-3 w-80 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
            style={{ backgroundColor: "var(--input-area-bg-color)" }}
            type="email"
            id="changeEmailInput"
            name="email"
            autoComplete="email"
            placeholder={t("email")}
            value={userData.email}
            onChange={handleChange}
          />
          <br />
          <Typography variant="h6">{t("password")}</Typography>
          <input
            className="p-3 w-80 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
            style={{ backgroundColor: "var(--input-area-bg-color)" }}
            type="password"
            id="changePasswordInput"
            name="password"
            autoComplete="new-password"
            placeholder={t("password")}
            value={userData.password}
            onChange={handleChange}
          />
          <br />
          <Button
            style={{ marginTop: "2rem" }}
            className="w-20 h-10"
            onClick={handleSave}
            variant="contained"
            color="primary"
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
