import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Doğru kullanım bu şekildedir
import { capitalizeFirstLetter } from "../utils/stringUtils";
import { fetchUserDetails, updateUserDetails } from "../api"; // API çağrılarını içe aktarın
import { useTranslation } from "react-i18next";

const EditProfilePage = () => {
  const { t } = useTranslation();
  const userToken = sessionStorage.getItem("token") || localStorage.getItem("token");
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const [userPerm, setUserPerm] = useState("");
  const formattedName = capitalizeFirstLetter(username);
  const formattedPerm = capitalizeFirstLetter(userPerm);

  useEffect(() => {
    console.log("Token:", userToken);
    if (userToken) {
      const data = jwtDecode(userToken);
      getUserDetails(data.id);
    }
  }, [userToken]);

  const getUserDetails = async (userId) => {
    try {
      const userData = await fetchUserDetails(userId);
      setUsername(userData.username);
      setUserProfilePicture(userData.imageUrl);
      setUserPerm(userData.role);
    } catch (error) {
      console.error(t("Error fetching user details:"), error);
      navigate("/login");
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    try {
      const result = await updateUserDetails(userId, data);
      console.log(result);
    } catch (error) {
      console.error(t("Error updating user details:"), error);
    }
  };

  useEffect(() => {
    getUserDetails(userId);
  }, [userId]);

  if (!username) return <div>{t("Loading...")}</div>;

  return (
    <div className="flex flex-col items-center justify-center">
      <img
        className="w-40 h-40 object-cover rounded-full mb-2"
        src={
          userProfilePicture ||
          "https://cdn.pixabay.com/photo/2015/04/18/11/03/profile-728591_1280.jpg"
        }
        alt="user"
      />
      <form onSubmit={handleEditProfile}>
        <div>
          <label htmlFor="username">{t("Username")}:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="profilePicture">{t("Profile Picture")}:</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={(e) => setUserProfilePicture(URL.createObjectURL(e.target.files[0]))}
          />
        </div>
        <button type="submit">{t("Save")}</button>
      </form>
    </div>
  );
};

export default EditProfilePage;
