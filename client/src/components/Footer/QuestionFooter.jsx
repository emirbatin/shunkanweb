import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../Language Selector/language-selector";
import ThemeSelector from "../Change Theme/ChangeTheme.jsx";

function QuestionFooter() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row fixed bottom-0 left-0 right-0 w-full p-4 bg-white">
      <div className="flex justify-between w-full">
        <Button
          variant="contained"
          color="primary"
          style={{ margin: 10 }}
          onClick={handleCheckAnswer}
        >
          Kontrol Et
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ margin: 10 }}
          onClick={handleSkip}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}

export default QuestionFooter;
