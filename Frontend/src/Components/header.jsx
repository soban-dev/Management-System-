import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Typography,
  Box,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(1),
  width: "100%",
  maxWidth: "200px", 
  [theme.breakpoints.up("sm")]: {
    maxWidth: "250px", 
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

function Header({ toggleSidebar }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const pageTitles = {
    "/": "Dashboard",
    "/billing": "Billing",
    "/tables": "Tables",
    "/profile": "Profile",
    "/sign-in": "Sign In",
    "/sign-up": "Sign Up",
  };

  const title = pageTitles[location.pathname] || "Dashboard";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
    
  
    const navigate = useNavigate(); 

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: scrolled ? "rgba(52, 71, 103, 0.1)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
        color: "#FFF",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: { xs: 72, md: 80 },
        padding: scrolled ? "8px 16px" : "16px 24px",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: { xs: "wrap", md: "nowrap" }, 
        }}
      >
        {/* Left Section: Logo and Breadcrumbs */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", md: "auto" },
            justifyContent: { xs: "space-between", md: "flex-start" },
            mb: { xs: 1, md: 0 }, 
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <HomeIcon sx={{ color: "#FFF", fontSize: 24, mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: "18px",
                display: { xs: "none", sm: "block" },
              }}
            >
              {title}
            </Typography>
          </Box>
          <IconButton
            sx={{
              color: "#AAA",
              display: { xs: "block", md: "none" },
            }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Right Section: Icons and Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", md: "auto" },
            justifyContent: { xs: "space-between", md: "flex-end" },
            mt: { xs: 1, md: 0 },
          }}
        >
          {/* Icons */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
      
      {/* Settings Icon */}
      <IconButton
        sx={{ color: "#AAA" }}
        onClick={() => navigate("/profile")} 
      >
        <SettingsIcon />
      </IconButton>

      {/* Notifications Icon */}
      <IconButton
        sx={{ color: "#AAA" }}
        onClick={() => navigate("/notifications")} 
      >
        <NotificationsIcon />
      </IconButton>          
      </Box>

          {/* Search Bar */}
          <Search
            sx={{
              marginLeft: { xs: 1, md: 2 },
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            <SearchIconWrapper>
              <SearchIcon sx={{ color: "#AAA" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search here"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
