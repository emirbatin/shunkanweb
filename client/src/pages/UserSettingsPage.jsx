import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../components/Sidebar/Sidebar";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";

const UserSettingsPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();



  const { t } = useTranslation();

  const userToken =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  useEffect(() => {
    console.log("Token:", userToken);
    if (userToken) {
      const data = jwtDecode(userToken);
      fetchUserDetails(data.id);
    }
  }, [userToken]);

  const fetchUserDetails = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const userData = await res.json();
      if (!res.ok) throw new Error(userData.error || "Bir hata oluştu");
      console.log(userData);
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
    }
  };

  return (
    <div className="flex flex-row">
      <div className="flex">
        <Sidebar></Sidebar>
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
            name="changeUsernameInput"
            autoComplete="username"
            placeholder={t("username")}
            value={null}
            onChange={null}
          />
          <br />
          <Typography variant="h6">{t("email")}</Typography>
          <input
            className="p-3 w-80 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
            style={{ backgroundColor: "var(--input-area-bg-color)" }}
            type="email"
            id="changeEmailInput"
            name="changeEmailInput"
            autoComplete="username"
            placeholder={t("email")}
            value={null}
            onChange={null}
          />
          <br />
          <Typography variant="h6">{t("password")}</Typography>
          <input
            className="p-3 w-80 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
            style={{ backgroundColor: "var(--input-area-bg-color)" }}
            type="password"
            id="changePasswordInput"
            name="changePasswordInput"
            autoComplete="username"
            placeholder={t("password")}
            value={null}
            onChange={null}
          />
          <br />
          <Button
            style={{ marginTop: "2rem" }}
            className="w-20 h-10"
            onClick={() => navigate(`/editprofile/${userId}`)}
            variant="contained"
            color="primary"
          >
            {t("save")}
          </Button>
        </div>
        <input type="text" />
      </div>
    </div>
  );
};

export default UserSettingsPage;
