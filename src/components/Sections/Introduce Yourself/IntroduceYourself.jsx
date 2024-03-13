import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./IntroduceYourself.css";

const Section2 = ({ goToNextSection }) => {
  const [name, setName] = useState("");
  const { t } = useTranslation();

  const handleUsernameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div className="sectionIntroduceYourself">
      <div className="introduceYourselfContainer">
        <h1 className="introduceTitle">{t("What should we call you?")}</h1>
        <input
          className="introduceNameInput"
          type="text"
          placeholder={t("Name")}
          value={name}
          onChange={handleUsernameChange}
        />
        <button className="nextSectionButton" onClick={goToNextSection}>{t("Next Section")}</button>
      </div>
    </div>
  );
};

export default Section2;
