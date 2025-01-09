import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Avatar,
  Paper,
  Typography,
  Divider,
  Stack,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import backgroundImage from "../../assets/bg-reset-cover.jpeg";
import avatarImage from "../../assets/team-4.jpg";
import { BASE_URL } from "../../config";
import ProfilePasswordChange from "../../Components/Profile/passwordchange";

const ProfileComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const textFieldRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/profile/profile`, {
          withCredentials: true,
        });
        const data = response.data;
        setProfileData(data?.data || {});
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const { name, phone, email, address } = profileData;
    if (!name || !phone || !email || !address) {
      alert("Please fill out all the fields before saving!");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/update-profile`,
        profileData,
        {
          withCredentials: true,
        }
      );
      // console.log("Profile updated successfully:", response.data);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      // console.error("Error updating profile data:", error);
      alert("Error updating profile data");
    }
  };

  const handleChange = (field, value) => {
    setProfileData((prevState) => ({ ...prevState, [field]: value }));
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#1A202C",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "22px",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          width: "100%",
          height: "250px",
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "22px",
        }}
      />

      {/* Profile Card */}
      <Paper
        elevation={5}
        sx={{
          width: "85%",
          maxWidth: "900px",
          backgroundColor: "#2D3748",
          borderRadius: "22px",
          p: 5,
          mt: -10,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {/* Left Section */}
        <Box sx={{ flex: 1 }}>
          <Stack direction="column" alignItems="center">
            <Avatar
              sx={{
                width: 120,
                height: 120,
                backgroundImage: `url(${avatarImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "4px solid #1A202C",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.5)",
                objectFit: "cover",
              }}
              src={avatarImage}
              alt="Profile Avatar"
            />
            <Typography
              variant="h5"
              mt={2}
              sx={{ color: "white", fontWeight: "bold" }}
            >
              {profileData.name || "Richard Davis"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#A0AEC0", mb: 4 }}>
              {profileData.role || "CEO / Co-Founder"}
            </Typography>
          </Stack>

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "white",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Platform Settings
          </Typography>

          {/* Rules and Regulations */}
          <Typography
            variant="body2"
            sx={{
              color: "#A0AEC0",
              mb: 1,
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Rules and Regulations
          </Typography>
          <List sx={{ paddingLeft: 2 }}>
            <ListItem disableGutters>
              <ListItemText
                primary="Your account must comply with all applicable laws and regulations."
                primaryTypographyProps={{
                  sx: { color: "white", fontSize: "14px", lineHeight: "1.8" },
                }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Ensure the security of your account by safeguarding your password."
                primaryTypographyProps={{
                  sx: { color: "white", fontSize: "14px", lineHeight: "1.8" },
                }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Avoid sharing sensitive or private information in public spaces."
                primaryTypographyProps={{
                  sx: { color: "white", fontSize: "14px", lineHeight: "1.8" },
                }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Respect other members and maintain a professional demeanor."
                primaryTypographyProps={{
                  sx: { color: "white", fontSize: "14px", lineHeight: "1.8" },
                }}
              />
            </ListItem>
          </List>
        </Box>

        {/* Right Section */}
        <Box sx={{ flex: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Profile Information
            </Typography>
            {isEditing ? (
              <IconButton sx={{ color: "white" }} onClick={handleSaveClick}>
                <SaveIcon />
              </IconButton>
            ) : (
              <IconButton sx={{ color: "white" }} onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
            )}
          </Stack>

          {/* Editable Profile Information */}
          <Box sx={{ mt: 2 }}>
            {[
              { label: "Full Name", value: profileData.name, field: "name" },
              { label: "Mobile", value: profileData.phone, field: "phone" },
              { label: "Email", value: profileData.email, field: "email" },
              {
                label: "Location",
                value: profileData.address,
                field: "address",
              },
            ].map(({ label, value, field }) => (
              <Stack
                direction="row"
                justifyContent="space-between"
                mb={2}
                key={field}
              >
                <Typography variant="body2" sx={{ color: "#A0AEC0" }}>
                  {label}:
                </Typography>
                {isEditing ? (
                  <TextField
                    variant="filled"
                    value={value || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    sx={{
                      backgroundColor: "#2D3748",
                      borderRadius: "5px",
                      width: "60%",
                    }}
                    InputProps={{
                      sx: { color: "white", fontSize: "14px" },
                    }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ color: "white" }}>
                    {value || "N/A"}
                  </Typography>
                )}
              </Stack>
            ))}
          </Box>
          <Divider sx={{ my: 3, backgroundColor: "#4A5568" }} />
          <ProfilePasswordChange />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileComponent;
