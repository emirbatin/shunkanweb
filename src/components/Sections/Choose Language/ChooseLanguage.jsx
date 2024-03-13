import React, { useState } from "react";
import "./ChooseLanguage.css";
import { useTranslation } from "react-i18next";
import japaneseFlag from "../../../assets/images/Flag_of_Japan.png";
import americanFlag from "../../../assets/images/Flag_of_the_United_States.png";
import turkishFlag from "../../../assets/images/Flag-Turkey.webp";

const Section1 = ({ goToNextSection }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    // Burada dil seçimi sonrası istediğiniz ek işlemleri yapabilirsiniz.
  };

  const isSelected = (languageCode) => selectedLanguage === languageCode;

  return (
    <div className="sectionChooseLanguage">
      <div className="chooseLangContainer">
        <h1 className="chooseLangTitle">
          Select the sign language you want to learn
        </h1>
        <div className="langContainer">
          <div
            className={`langCard ${isSelected("jp") ? "selected" : ""}`}
            onClick={() => handleLanguageSelect("jp")}
          >
            <img
              src={japaneseFlag}
              className="flag"
              alt="Japanese Sign Language"
            />
            <h2 className="jp">Japanese</h2>
          </div>
          <div
            className={`langCard ${isSelected("us") ? "selected" : ""}`}
            onClick={() => handleLanguageSelect("us")}
          >
            <img
              src={americanFlag}
              className="flag"
              alt="American Sign Language"
            />
            <h2 className="us">American</h2>
          </div>
          <div
            className={`langCard ${isSelected("tr") ? "selected" : ""}`}
            onClick={() => handleLanguageSelect("tr")}
          >
            <img
              src={turkishFlag}
              className="flag"
              alt="Turkish Sign Language"
            />
            <h2 className="tr">Turkish</h2>
          </div>
        </div>
        <button
          className="nextSectionButton"
          onClick={() => {
            console.log("Selected Language:", selectedLanguage); // Seçilen dili konsola yazdır
            goToNextSection();
          }}
        >
          Next Section
        </button>
      </div>
    </div>
  );
};

export default Section1;
