import React, { useEffect } from "react";
import lottie from "lottie-web";
import Womanfocusedononlinelearning from "../assets/lottie/Womanfocusedononlinelearning.json";

import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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
      <div className="flex flex-row h-screen">
        {/*Right Container */}
        <div className="flex-1 flex flex-col justify-center items-start text-left pl-60 pb-40">
          <Typography className="welcomePageTitle" variant="h3">
            {t("appTitle")}
          </Typography>
          <Typography sx={{ mt: 2, mb: 2, color: "var(--text-secondary-color)" }} variant="h6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Typography>

          <Button
            className="nextButton"
            variant="contained"
            type="button"
            onClick={() => handleNavigate("/createAccount")} // Butona tıklandığında yönlendirme yap
          >
            Let's Start
          </Button>
          <div className="buttonContainer">
            {/*Login Text */}
            <Typography
              variant="body1"
              sx={{
                cursor: "pointer", // CSS cursor özelliğini pointer olarak ayarlar
                mt: 2.5, // margin-top değerini tema ölçeğine göre ayarlar (tailwind mt-10 yaklaşık olarak 2.5rem)
                color: "var(--text-color)", // metin rengini beyaz yapar
              }}
              onClick={() => navigate("/login")} // onClick ile yönlendirme fonksiyonunu çağırır
            >
              You're not new? then log in!
            </Typography>
          </div>
        </div>
        {/*Left Container */}
        <div className="flex-2 flex flex-col justify-center items-center pr-20 pb-40">
          <div id="welcomeLottie" className="w-max h-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
