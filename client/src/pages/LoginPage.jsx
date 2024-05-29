import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AppleIcon from "@mui/icons-material/Apple";
import Google from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import lottie from "lottie-web";
import Onlinelanguagelearning from "../assets/lottie/Onlinelanguagelearning.json";
import youbannedlol from "../assets/images/ubannedlol.png";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }
      const json = await response.json();
      const token = json.token;
      console.log("Token:", token); // Token'ı kontrol edin
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);
      console.log("Login successful. Token:", token);
      setIsLoggedIn(true);
      navigate("/courses");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    // Logout işlemi
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      navigate("/courses");
    }
  }, []);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: document.getElementById("loginPageLottie"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: Onlinelanguagelearning,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        progressiveLoad: true,
        hideOnTransparent: true,
      },
    });

    return () => {
      animation.destroy();
    };
  }, []);

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <div className="flex flex-row h-screen">
      <div className="flex-1 flex flex-col justify-center items-start text-left ml-40 mr-20 pb-40">
        <Typography variant="h4" sx={{ mb: 1 }}>
          {t("pickupwhereyouleftoffandlogin!")}
        </Typography>
        <form
          className="flex flex-col justify-center items-start text-left w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col justify-center items-start text-left w-full mb-1">
            <Typography
              variant="subtitle1"
              sx={{ mb: 0.5, color: "var(--text-color)" }}
            >
              {t("username")}
            </Typography>
            <input
              className="p-3 w-3/4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
              style={{ backgroundColor: "var(--input-area-bg-color)" }}
              type="text"
              id="loginUsernameInput"
              name="loginUsernameInput"
              autoComplete="username"
              placeholder={t("username")}
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="flex flex-col justify-center items-start text-left w-full">
            <Typography
              variant="subtitle1"
              sx={{ mb: 0.5, color: "var(--text-color)" }}
            >
              {t("password")}
            </Typography>
            <input
              className="p-3 w-3/4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              style={{ backgroundColor: "var(--input-area-bg-color)" }}
              id="loginPasswordInput"
              name="loginPasswordInput"
              autoComplete="password"
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <label
            className="flex flex-row mb-2 mt-2"
            htmlFor="cameraAccessCheckbox"
          >
            <input
              id="rememberMeCheckbox"
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <Typography
              className="cameraAccessLabel"
              variant="h7"
              sx={{ ml: 1 }}
            >
              {t("rememberme")}
            </Typography>
          </label>
          <Button
            sx={{ mt: 1, height: 50, width: 150 }}
            variant="contained"
            type="submit"
          >
            {t("login")}
          </Button>
          <div className="flex flex-row justify-between pt-2 pb-2 items-center text-center w-full">
            <hr
              className="w-1/2 h-2 border-none rounded-md"
              style={{ backgroundColor: "var(--button-color)" }}
            />
            <Typography
              variant="h5"
              sx={{ color: "var(--button-color)", mb: 1, ml: 1, mr: 1 }}
            >
              {t("or")}
            </Typography>
            <hr
              className="w-1/2 h-2 border-none rounded-md"
              style={{ backgroundColor: "var(--button-color)" }}
            />
          </div>
          <div className="grid grid-cols-2 grid-rows-1 gap-4">
            <Button
              className="mt-0 h-10 w-40 rounded-md text-white cursor-pointer apple-button"
              variant="contained"
              startIcon={<AppleIcon className="appleIcon" />}
              type="button"
            >
              {t("signinwithapple")}
            </Button>
            <Button
              className="mt-0 h-10 w-40 rounded-md text-white cursor-pointer facebook-button"
              variant="contained"
              startIcon={<FacebookIcon className="facebookIcon" />}
              type="button"
            >
              {t("signinwithfacebook")}
            </Button>
            <Button
              className="mt-0 h-10 w-40 rounded-md text-white cursor-pointer google-button"
              variant="contained"
              startIcon={<Google className="googleIcon" />}
              type="button"
            >
              {t("signinwithgoogle")}
            </Button>
          </div>
        </form>
      </div>
      <div className="flex-1 flex flex-col justify-center pr-80 pb-40 ml-10">
        <div id="loginPageLottie" className="flex w-full-150 h-auto"></div>
      </div>
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
