import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Switch,
  FormControlLabel,
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Book";
import GitHubIcon from "@mui/icons-material/Badge";
import GoogleIcon from "@mui/icons-material/Person";
import { styled } from "@mui/system";
import backgroundImage from "../../assets/bg-sign-in-basic.jpeg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";

const BackgroundBox = styled(Box)({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
});

const StyledContainer = styled(Box)({
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  paddingTop: "50px",
  paddingBottom: "20px",
  width: "100%",
  maxWidth: "400px",
  position: "relative",
});

const HeaderBox = styled(Box)({
  position: "absolute",
  top: "-47px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#1976d2",
  color: "white",
  borderRadius: "12px",
  padding: "13px 75px",
  textAlign: "center",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "@media (max-width: 600px)": {
    padding: "13px 30px", 
  },
});

const SocialButtonsBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "16px",
  marginTop: "10px",
});

const SocialButton = styled(Avatar)({
  backgroundColor: "white",
  color: "#1976d2",
  border: "1px solid #1976d2",
  width: "40px",
  height: "40px",
});

const FormBox = styled(Box)({
  padding: "20px",
});

export default function SignIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    let tempErrors = {};

    // Validate Username (Length Check)
    if (formData.username.length < 3) {
      tempErrors.username = "Username must be at least 3 characters.";
    }

    // Validate Password (Regex Check)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      tempErrors.password =
        "Password must be at least 8 characters, including uppercase, lowercase, a number, and a symbol.";
    }

    // If there are any validation errors, return early
    if (Object.keys(tempErrors).length > 0) {
      setFormErrors(tempErrors);
      return;
    }

    setLoading(true); // Start loading

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: 'include', // Include cookies in the request
        });

        const result = await response.json();
        // console.log("Response from backend:", result);

        if (result.success === true) {
            // Optionally, you can store role in localStorage
            if (result.role === "employee") {
                localStorage.setItem("role", "user");  
            } else {
                localStorage.setItem("role", result.role);  
            } 

            // Navigate based on role
            if (result.role === "admin") {
                navigate("/dashboard");
            } else if (result.role === "employee") {
                navigate("/billing");
            }
        } else {
            setErrorMessage(result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        setErrorMessage("An error occurred during sign-in.");
    } finally {
        setLoading(false); // Stop loading once the request is done
    }
  };

  return (
    <BackgroundBox>
      <CssBaseline />
      <StyledContainer>
        <HeaderBox>
          <Typography variant="h5" fontFamily="Roboto, sans-serif">
            Sign in
          </Typography>
          <SocialButtonsBox>
            <SocialButton>
              <FacebookIcon />
            </SocialButton>
            <SocialButton>
              <GitHubIcon />
            </SocialButton>
            <SocialButton>
              <GoogleIcon />
            </SocialButton>
          </SocialButtonsBox>
        </HeaderBox>
        <FormBox>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="UserName"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              error={Boolean(formErrors.username)}
              helperText={formErrors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(formErrors.password)}
              helperText={formErrors.password}
            />
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Remember me"
              sx={{ marginTop: 2 }}
            />
            <Button
              className="rounded-[10px]"
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: 2,
                marginBottom: 2,
                backgroundColor: "#1976d2",
                fontWeight: "bold",
                position: "relative",
              }}
              disabled={loading} // Disable the button while loading
            >
             {loading ? (
    <CircularProgress size={24} color="inherit" />
  ) : (
    "SIGN IN"
  )}
</Button>
            <Typography
              variant="body2"
              align="center"
              sx={{
                color: "red",
                marginBottom: 2,
              }}
            >
              {errorMessage}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => navigate("/sign-up")}
            >
              Don’t have an account? Sign up
            </Typography>
          </Box>
        </FormBox>
      </StyledContainer>
    </BackgroundBox>
  );
}
