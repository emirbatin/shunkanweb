import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Block, CheckCircle } from "@mui/icons-material";
import { banUser } from "../../../api";  // API fonksiyonunu import edin

const UsersTable = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    console.log("Users:", users);
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter((user) => user.username.toLowerCase().includes(term))
    );
  };

  const handleBan = async (id) => {
    try {
      const data = await banUser(id);
      // Update the user state with the new banned status
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, banned: data.user.banned } : user
        )
      );
    } catch (error) {
      console.error("Failed to ban/unban user:", error);
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/100";
    return `${process.env.REACT_APP_API_URL}/${path}`;
  };

  return (
    <div>
      <Typography variant="h6" className="text-2xl font-bold mb-4 text-left">
        Users
      </Typography>
      <br />
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />

      <TableContainer component={Paper} className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile Image</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Registered</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <img
                    src={getFullImageUrl(user.imagePath)}
                    alt={user.name}
                    className="rounded-md w-12 h-12 object-cover block"
                  />
                </TableCell>

                <TableCell>{user._id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.plan}</TableCell>
                <TableCell>
                  <Tooltip title={user.banned ? "Unban" : "Ban"}>
                    <IconButton
                      color={user.banned ? "primary" : "secondary"}
                      onClick={() => handleBan(user._id)}
                    >
                      {user.banned ? <CheckCircle /> : <Block />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UsersTable;
