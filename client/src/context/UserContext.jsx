// contexts/UserContext.js
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [userPerm, setUserPerm] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [userId, setUserId] = useState("");
  const [sidebarProfilePicture, setSidebarProfilePicture] = useState("");

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        userPerm,
        setUserPerm,
        userProfilePicture,
        setUserProfilePicture,
        userId,
        setUserId,
        sidebarProfilePicture,
        setSidebarProfilePicture,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
