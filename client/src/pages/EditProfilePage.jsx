import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { capitalizeFirstLetter } from "../utils/stringUtils";


const EditProfilePage = () => {
  const userToken =
    sessionStorage.getItem("token") || localStorage.getItem("token");
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
      setUserPerm(userData.role);
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
      navigate("/login");
    }
  };

  //patch request

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
        body: data,
    });
    const result = await response.json();
    console.log(result);
  }

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
    <div className="flex flex-col items-center justify-center">
      <img
        className="w-40 h-40 object-cover rounded-full mb-2"
        src={
          userProfilePicture ||
          "https://cdn.pixabay.com/photo/2015/04/18/11/03/profile-728591_1280.jpg"
        }
        alt="user"
      />
    </div>
  );
};

export default EditProfilePage;
