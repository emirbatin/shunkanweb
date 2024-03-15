import React, { useEffect } from "react";
import lottie from "lottie-web";
import Womanfocusedononlinelearning from "../../assets/lottie/Womanfocusedononlinelearning.json";
import "./WelcomePage.css";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Button from "@mui/material/Button";


const WelcomePage = () => {
  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: document.getElementById("welcomeLottie"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: Womanfocusedononlinelearning,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        progressiveLoad: true,
        hideOnTransparent: true,
      },
    });

    return () => {
      animation.destroy(); // Clean up the animation
    };
  }, []);

  const { t } = useTranslation();
  const navigate = useNavigate();

  // Rotalama işlevini tetiklemek için kullanılacak yöntem
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div>
      <div className="welcomeContainer">
        <div className="welcomeRightContainer">
          <h1 className="welcomePageTitle">{t("appTitle")}</h1>
          <h2 className="welcomePageDesc">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </h2>
          <Button
            className="nextButton"
            variant="contained"
            type="button"
            onClick={() => handleNavigate('/createAccount')} // Butona tıklandığında yönlendirme yap
          >
            Let's Start
          </Button>
          <div className="buttonContainer">
            <p className="welcomeLoginText" onClick={() => navigate("login")}>
              You're not new? then log in!
            </p>
          </div>
        </div>
        <div className="welcomeLeftContainer">
          <div id="welcomeLottie" className="welcomeLottie"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
