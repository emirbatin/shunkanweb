import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import Sidebar from "../components/Sidebar/Sidebar";
import StatisticCards from "../components/StatisticCard/StatisticCards";
import FlameImage from "../assets/illustrations/flame.png";
import BadgeImage from "../assets/illustrations/badge.png";

const ProfilePage = () => {
  const userToken = sessionStorage.getItem("token") || localStorage.getItem("token");
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [sidebarProfilePicture, setSidebarProfilePicture] = useState(""); // Yeni eklenen durum
  const [userBannerPicture, setUserBannerPicture] = useState("");
  const [username, setUsername] = useState("");
  const [userPerm, setUserPerm] = useState("");
  const [userDailySeries, setUserDailySeries] = useState(0);
  const [userTotalPoint, setUserTotalPoint] = useState(0);
  const [userRank, setUserRank] = useState("Bronze");
  const [editMode, setEditMode] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);

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
      setUser(userData);
      setUsername(userData.username);
      setUserProfilePicture(userData.imageUrl);
      setSidebarProfilePicture(userData.imageUrl); // Sidebar resmi güncellenir
      setUserBannerPicture(userData.bannerUrl);
      setUserPerm(userData.role);
      setUserDailySeries(userData.dailySeries || 0);
      setUserTotalPoint(userData.totalPoint || 0);
      setUserRank(userData.rank || "Bronze");
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
      navigate("/login");
    }
  };

  const handleEditClick = async () => {
    if (editMode) {
      const formData = new FormData();
      if (profileImageFile) formData.append("image", profileImageFile);
      if (bannerImageFile) formData.append("banner", bannerImageFile);
      formData.append("username", username);
      formData.append("role", userPerm);

      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: "PATCH",
          body: formData,
        });
        if (!res.ok) throw new Error("Failed to update user");
        const updatedUser = await res.json();
        setUserProfilePicture(updatedUser.imageUrl);
        setUserBannerPicture(updatedUser.bannerUrl);
        setSidebarProfilePicture(updatedUser.imageUrl); // Sidebar resmi güncellenir
        fetchUserDetails(userId);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
    setEditMode(!editMode);
  };

  const handleProfilePictureClick = () => {
    if (editMode) document.getElementById("profile-picture-input").click();
  };

  const handleBannerClick = () => {
    if (editMode) document.getElementById("banner-picture-input").click();
  };

  const onProfilePictureChange = (e) => {
    setProfileImageFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setUserProfilePicture(url);
  };

  const onBannerPictureChange = (e) => {
    setBannerImageFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setUserBannerPicture(url);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex w-auto h-full justify-start items-start flex-row">
      {/* Sidebar Component */}
      <Sidebar userProfilePicture={sidebarProfilePicture} />

      <div className="flex flex-col h-full w-full px-5">
        <div className="flex flex-grow flex-row items-center">
          <div className="flex flex-col items-start justify-center w-60 h-80 relative z-10 bg-white bg-opacity-20 backdrop-blur-md">
            <div className="flex flex-col items-start ml-4">
              <img
                className="w-40 h-40 object-cover rounded-full mb-2"
                src={
                  userProfilePicture ||
                  "https://cdn.pixabay.com/photo/2015/04/18/11/03/profile-728591_1280.jpg"
                }
                style={{ cursor: editMode ? "pointer" : "default" }}
                onClick={handleProfilePictureClick}
                alt="user"
              />
              <input
                type="file"
                id="profile-picture-input"
                style={{ display: "none" }}
                onChange={onProfilePictureChange}
                accept="image/*"
              />
              <Typography variant="h5">
                {capitalizeFirstLetter(username)}
              </Typography>
              <Typography variant="h7" style={{ color: "var(--text-color)" }}>
                {capitalizeFirstLetter(userPerm)}
              </Typography>
            </div>
            <div>
              <Button
                style={{ marginTop: "2rem" }}
                variant="text"
                color="primary"
                onClick={handleEditClick}
              >
                {editMode ? "Save" : "Edit"}
              </Button>
            </div>
          </div>
          <div
            className="w-full h-[20rem] absolute z-0"
            style={{ cursor: editMode ? "pointer" : "default" }}
            onClick={handleBannerClick}
          >
            <img
              src={
                userBannerPicture ||
                "https://images3.alphacoders.com/133/1332803.png"
              }
              alt="user"
              className="absolute w-full h-full object-cover"
            />
            <input
              type="file"
              id="banner-picture-input"
              style={{ display: "none" }}
              onChange={onBannerPictureChange}
              accept="image/*"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <br />
          <div className="flex items-start justify-start text-left">
            <Typography variant="h5">User Statistics</Typography>
          </div>
          <br />

          <div className="grid grid-cols-3 grid-rows-1 gap-4">
            <div className="col-span-1 row-span-1">
              <StatisticCards
                CardImageSrc={FlameImage}
                CardIconBGColor="bg-red-200"
                CardTitle="Daily Series"
                UserStatisticData={userDailySeries}
              />
            </div>
            <div className="col-span-1 row-span-1">
              <StatisticCards
                CardTitle="Total Point"
                CardIconBGColor="bg-orange-300"
                UserStatisticData={userTotalPoint}
              />
            </div>
            <div className="col-span-1 row-span-1">
              <StatisticCards
                CardImageSrc={BadgeImage}
                CardTitle="Rank"
                CardIconBGColor="bg-purple-200"
                UserStatisticData={userRank}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
