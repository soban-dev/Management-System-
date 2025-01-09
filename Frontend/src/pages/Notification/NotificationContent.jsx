import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loader visibility
  const [processingId, setProcessingId] = useState(null); // State to track which action is processing
  const [userStatus, setUserStatus] = useState(false); // State to toggle user status
  const location = useLocation();

  // Generic Handler for Verify, Delete, and Admin actions
  const handleAction = async (id, username, actionType) => {
    setProcessingId(id); // Set the current processing ID to show loader

    try {
      // Define the payload based on the action type
      const payload = { employeeId: id, username: username };

      // Send POST request to perform the action
      const response = await axios.post(
        `${BASE_URL}/admin/action`,
        { action: actionType, payload },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored and retrieved correctly
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        alert(
          `${
            actionType.charAt(0).toUpperCase() + actionType.slice(1)
          } action successful for ${username}.`
        );
        fetchNotifications(); // Refresh notifications after successful action
      } else {
        alert(`Failed to perform ${actionType} action for ${username}.`);
      }
    } catch (error) {
      console.error(`Error performing ${actionType} action:`, error);
      alert(`An error occurred while trying to ${actionType} the user.`);
    } finally {
      setProcessingId(null); // Reset the processing ID
    }
  };

  // Handler to dismiss notification without performing any action
  const handleDismiss = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== id)
    );
  };

  const toggleUserStatus = async () => {
    setUserStatus((prevStatus) => !prevStatus); // Toggle status
    // fetchNotifications(); // Fetch notifications after toggling status
  };

  useEffect(() => {
    // Fetch notifications after userStatus changes
    fetchNotifications();
  }, [userStatus]); // Trigger fetch when userStatus changes

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/admin/employees?verified=${userStatus}`,
        {
          headers: {
            withCredentials: true,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      if (data.unverified && Array.isArray(data.unverified)) {
        const notifications = data.unverified.map((user) => ({
          id: user._id,
          username: user.username,
          message: `Click to verify ${user.username}`,
        }));

        setNotifications(notifications);
      } else {
        console.error("Fetched data is not in expected array format.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      alert("An error occurred while fetching notifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1000,
        margin: "20px auto",
        padding: "0 20px",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          backgroundColor: "#1A202C",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: "10px" }}
        >
          <Box></Box>

          <Typography
            variant="h4"
            sx={{
              marginLeft: "140px",
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "'Roboto', sans-serif",
              textAlignLast: "center",
            }}
          >
            {userStatus ? "Verified Employee" : "Unverified Users"}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1E90FF",
              color: "white",
              fontWeight: "bold",
              padding: "6px 16px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1E60FF",
              },
            }}
            onClick={toggleUserStatus}
          >
            {userStatus === false ? "Verified Users" : "Unverified Users"}
          </Button>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: "#A0AEC0",
            textAlign: "center",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          You will get all important messages or popups here.
        </Typography>

        {/* Show loader while fetching notifications */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <Box
              key={notification.id}
              sx={{
                backgroundColor: "#ff1100a8",
                color: "white",
                padding: "15px 25px",
                borderRadius: "10px",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "nowrap", // Prevent wrapping
              }}
            >
              {/* Notification Message */}
              <Typography
                sx={{
                  fontWeight: "bold",
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginRight: "16px",
                }}
              >
                {notification.message}
              </Typography>

              {/* Action Buttons and Close Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexShrink: 0,
                }}
              >
                {/* Verify Button */}
                {userStatus === false && (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor:
                        processingId === notification.id ? "#ccc" : "#4CAF50",
                      color: "white",
                      fontWeight: "bold",
                      padding: "6px 16px",
                      borderRadius: "8px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor:
                          processingId === notification.id ? "#ccc" : "#45a049",
                      },
                    }}
                    onClick={() =>
                      handleAction(
                        notification.id,
                        notification.username,
                        "verify"
                      )
                    }
                    disabled={processingId === notification.id}
                  >
                    {processingId === notification.id ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                )}

                {/* Delete Button */}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor:
                      processingId === notification.id ? "#ccc" : "#f44336",
                    color: "white",
                    fontWeight: "bold",
                    padding: "6px 16px",
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor:
                        processingId === notification.id ? "#ccc" : "#d32f2f",
                    },
                  }}
                  onClick={() =>
                    handleAction(
                      notification.id,
                      notification.username,
                      "delete"
                    )
                  }
                  disabled={processingId === notification.id}
                >
                  {processingId === notification.id ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    "Delete"
                  )}
                </Button>

                {/* Admin Button */}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor:
                      processingId === notification.id ? "#ccc" : "#FF9800",
                    color: "white",
                    fontWeight: "bold",
                    padding: "6px 16px",
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor:
                        processingId === notification.id ? "#ccc" : "#f57c00",
                    },
                  }}
                  onClick={() =>
                    handleAction(
                      notification.id,
                      notification.username,
                      "admin"
                    )
                  }
                  disabled={processingId === notification.id}
                >
                  {processingId === notification.id ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    "Admin"
                  )}
                </Button>

                {/* Dismiss Icon */}
                <IconButton
                  color="primary"
                  onClick={() => handleDismiss(notification.id)}
                  sx={{
                    backgroundColor: "#ff1100a8",
                    "&:hover": {
                      backgroundColor: "#ff4500",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography
            sx={{
              textAlign: "center",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            No notifications available
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default NotificationComponent;
