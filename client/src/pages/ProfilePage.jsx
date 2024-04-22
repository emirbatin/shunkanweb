import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import Sidebar from "../components/Sidebar/Sidebar";

const ProfilePage = () => {
  const userToken =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [userBannerPicture, setUserBannerPicture] = useState("");
  const [username, setUsername] = useState("");
  const [userPerm, setUserPerm] = useState("");
  const formattedName = capitalizeFirstLetter(username);
  const formattedPerm = capitalizeFirstLetter(userPerm);

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
      setUsername(userData.username);
      setUserProfilePicture(userData.imageUrl);
      setUserBannerPicture(userData.bannerUrl);
      setUserPerm(userData.role);
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => {
        console.error("Error fetching user details:", error);
        navigate("/login");
      });
  }, [userId, navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex w-auto h-full justify-start items-start flex-row">
      {/* Sidebar Component */}
      <Sidebar></Sidebar>

      <div className="flex flex-col h-full w-full px-5"> {/*Daha sonra full olarak değiştireceğim*/}
        {/* Profile Page */}
        <div className="flex flex-grow flex-row items-center">
          <div className="flex flex-col items-start justify-center w-60 h-80 relative z-10 bg-white bg-opacity-20 backdrop-blur-md">
            <div className="flex flex-col items-start ml-4">
              <img
                className="w-40 h-40 object-cover rounded-full mb-2"
                src={
                  userProfilePicture ||
                  "https://cdn.pixabay.com/photo/2015/04/18/11/03/profile-728591_1280.jpg"
                }
                alt="user"
              />
              <Typography variant="h5">{formattedName}</Typography>
              <Typography variant="h7" style={{ color: "var(--text-color)" }}>
                {formattedPerm}
              </Typography>
            </div>
            <div>
              <Button
                style={{ marginTop: "2rem" }}
                onClick={() => navigate(`/editprofile/${userId}`)}
                variant="text"
                color="primary"
              >
                Edit
              </Button>
            </div>
          </div>
          <div className="w-full h-[20rem] absolute z-0">
            <img
              src={
                userBannerPicture ||
                "https://images3.alphacoders.com/133/1332803.png"
              }
              alt="user"
              className="absolute w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col">
          {/* User Statistic */}

          <div className="flex items-start justify-start text-left">
            <Typography variant="h5">User Statistics</Typography>
          </div>
          <div className="flex flex-row">
            {/*Right Container */}
            <div className="flex flex-col flex-grow">
              <Typography variant="h7">User Information</Typography>
            </div>

            {/* Left Container */}

            <div className="flex flex-col flex-grow">
              <Typography variant="h7">User Information</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
