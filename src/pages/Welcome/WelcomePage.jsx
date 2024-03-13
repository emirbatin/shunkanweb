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

const WelcomePage = () => {
  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: document.getElementById("lottie"),
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

    // Dönüş fonksiyonu olarak temizleyici fonksiyonu döndürün
    return () => {
      animation.destroy(); // Animasyonu temizle
    };
  }, []);

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <div className="container">
        <div className="right">
          <h1 className="pageTitle">{t("appTitle")}</h1>
          <h2 className="pageDesc">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </h2>
          <button
            className="next-page-button"
            onClick={() => navigate("/createAccount")}
          >
            {t("letsStart")}
          </button>
        </div>
        <div className="left">
          <div id="lottie" className="lottie"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
