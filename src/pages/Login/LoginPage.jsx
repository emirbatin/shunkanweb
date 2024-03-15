import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LoginPageStyle.css";
import Button from "@mui/material/Button";
import AppleIcon from "@mui/icons-material/Apple";
import Google from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import lottie from "lottie-web";
import Onlinelanguagelearning from "../../assets/lottie/Onlinelanguagelearning.json";

const LoginPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(username, password);
  };

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

    // Dönüş fonksiyonu olarak temizleyici fonksiyonu döndürün
    return () => {
      animation.destroy(); // Animasyonu temizle
    };
  }, []);

  return (
    <div>
      <div className="loginPageContainer">
        <div className="loginPageLeftContainer">
          <h1 className="loginPageTitle">
            {t("pickupwhereyouleftoffandlogin!")}
          </h1>
          <form className="loginPageForm" onSubmit={handleSubmit}>
            <div className="loginPageUsernameInputContainer">
              <p className="loginPageUsernameText">{t("username")}</p>
              <input
                className="loginPageUsernameInput"
                type="text"
                id="loginUsernameInput"
                name="loginUsernameInput"
                autoComplete="username"
                placeholder={t("username")}
                value={username}
                onChange={handleUsernameChange}
              />
            </div>

            <div className="loginPagePasswordInputContainer">
              <p className="loginPagePasswordText">{t("password")}</p>
              <input
                className="loginPagePasswordInput"
                id="loginPasswordInput"
                name="loginPasswordInput"
                autoComplete="password"
                type="password"
                placeholder={t("password")}
                value={password}
                onChange={handlePasswordChange}
                
              />
            </div>

            <Button
              className="loginButton"
              variant="contained"
              type="button"
              onClick={console.log("Login")}
            >
              {t("login")}
            </Button>

            <div className="loginPageLineContainer">
              <hr className="loginPageLine" />
              <p className="loginPageOR">{t("or")}</p>
              <hr className="loginPageLine" />
            </div>

            <div className="social-login-container">
              <Button
                className="apple-login-button"
                variant="contained"
                startIcon={<AppleIcon />}
                type="button"
              >
                {t("signinwithapple")}
              </Button>

              <Button
                className="facebook-login-button"
                variant="contained"
                startIcon={<FacebookIcon />}
                type="button"
              >
                {t("signinwithfacebook")}
              </Button>

              <Button
                className="google-login-button"
                variant="contained"
                startIcon={<Google />}
                type="button"
              >
                {t("signinwithgoogle")}
              </Button>
            </div>
          </form>
        </div>
        <div className="loginPageRightContainer">
          <div id="loginPageLottie" className="loginPageLottie"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
