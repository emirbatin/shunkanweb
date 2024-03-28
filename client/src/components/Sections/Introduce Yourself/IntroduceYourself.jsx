import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./IntroduceYourself.css";
import Button from "@mui/material/Button";

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

export default Section2;
