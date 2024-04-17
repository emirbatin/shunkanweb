import React, { useState, useContext } from "react"; // useContext'i burada import ediyoruz
import "./ChooseLanguage.css";
import { useTranslation } from "react-i18next";
import japaneseFlag from "../../../assets/images/Flag_of_Japan.png";
import americanFlag from "../../../assets/images/Flag_of_the_United_States.png";
import turkishFlag from "../../../assets/images/Flag-Turkey.webp";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LanguageContext from "../../../context/LanguageContext";

const Section1 = ({ onLanguageSelect, goToNextSection }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const { t } = useTranslation();

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode); // Yerel durumu güncelle
    onLanguageSelect(languageCode); // Üst bileşene bilgiyi aktar
    console.log("selected language: ", languageCode);
  };

  const isSelected = (languageCode) => selectedLanguage === languageCode;

  return (
    <div className="sectionChooseLanguage">
      {/* Choose Language Contaiter */}
      <div className="flex flex-col justify-center items-center w-auto h-auto pb-40">
        <Typography className="absolute top-20" variant="h6">
          {t("selectthesignlanguageyouwanttolearn")}
        </Typography>
        {/* Language Container */}
        <div className="flex flex-row justify-center items-center text-center w-auto h-auto m-24">
          <div
            className={`langCard ${isSelected("jp") ? "selected" : ""}`}
            onClick={() => handleLanguageSelect("jp")}
          >
            <img
              src={japaneseFlag}
              className="w-40 h-24 object-cover m-20 rounded-md"
              alt="Japanese Sign Language"
            />
            <Typography className="jp" variant="h5">
              {t("japanese")}
            </Typography>
          </div>
          <div
            className={`langCard ${isSelected("us") ? "selected" : ""}`}
            onClick={() => handleLanguageSelect("us")}
          >
            <img
              src={americanFlag}
              className="w-40 h-24 object-cover m-20 rounded-md"
              alt="American Sign Language"
            />
            <Typography className="up" variant="h5">
              {t("american")}
            </Typography>
          </div>
          <div
            className={`langCard ${isSelected("tr") ? "selected" : ""}`}
            onClick={() => handleLanguageSelect("tr")}
          >
            <img
              src={turkishFlag}
              className="w-40 h-24 object-cover m-20 rounded-md"
              alt="Turkish Sign Language"
            />
            <Typography className="tr" variant="h5">
              {t("turkish")}
            </Typography>
          </div>
        </div>
        <Button
          className="nextSectionButton"
          variant="contained"
          type="button"
          onClick={goToNextSection}
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};

export default Section1;
