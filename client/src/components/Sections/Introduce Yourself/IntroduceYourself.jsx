import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

const Section2 = ({ onUserName, goToNextSection }) => {
  const [name, setName] = useState("");
  const { t } = useTranslation();

  const handleUserNameChange = (event) => {
    setName(event.target.value);
    onUserName(event.target.value);
    console.log("name: ", event.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-center text-center w-auto h-screen">
      <div className="flex flex-col justify-center items-center text-center w-auto h-auto pb-40">
        <Typography variant="h5"> {t("whatshouldwecallyou")} </Typography>
        <input
          class="mt-5 p-4 w-[300%] border border-gray-300 rounded-md bg-input-area-bg-color text-text-color mb-8 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
          style={{
            color: "var(--text-color)",
            backgroundColor: "var(--input-area-bg-color)",
          }}
          type="text"
          placeholder={t("Name")}
          value={name}
          onChange={handleUserNameChange}
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
