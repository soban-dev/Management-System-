import React, { useState } from "react";
import { Box, TextField, Button, Typography, Divider } from "@mui/material";
import axios from "axios";

const ChangePasswordSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleSubmit = async () => {
    if (newPassword !== confirmNewPassword) {
      setMessage("New Password and Confirm Password do not match.");
      setMessageColor("red");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/changepassword`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setMessage("Password changed successfully!");
        setMessageColor("green");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setMessage("Failed to change password. Please try again.");
        setMessageColor("red");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "An error occurred while changing the password."
      );
      setMessageColor("red");
    }
  };

  return (
    <Box>
      {/* Clickable Header */}
      <Box
        sx={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#2D3748",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
        onClick={handleExpand}
      >
        <Typography sx={{ color: "white", fontWeight: "bold" }}>
          Change Password
        </Typography>
        <Typography sx={{ color: "white" }}>
          {isExpanded ? "---" : "--->>"}
        </Typography>
      </Box>

      {/* Expanded Form */}
      {isExpanded && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "10px",
            // backgroundColor: "#1A202C",
            borderRadius: "5px",
          }}
        >
          <TextField
            variant="outlined"
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            sx={{
              input: { color: "white" },
              label: { color: "#A0AEC0" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#A0AEC0",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />
          <TextField
            variant="outlined"
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            sx={{
              input: { color: "white" },
              label: { color: "#A0AEC0" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#A0AEC0",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />
          <TextField
            variant="outlined"
            type="password"
            label="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            fullWidth
            sx={{
              input: { color: "white" },
              label: { color: "#A0AEC0" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#A0AEC0",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Confirm
          </Button>
          {message && (
            <Typography
              sx={{
                color: messageColor,
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ChangePasswordSection;
