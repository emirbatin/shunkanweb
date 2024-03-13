import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Header.css";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../Language Selector/language-selector";
import ThemeSelector from "../Change Theme/ChangeTheme.jsx";

function CustomAppBar({ showIconButton, showThemeButton }) {
  const { t } = useTranslation();

  return (
    <AppBar position="static">
    <Toolbar>
      {showIconButton && (
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
      )}
      {showThemeButton && (
        <ThemeSelector />
      )}
      
      <Typography variant="h6">{t("appTitle")}</Typography>
      <LanguageSelector />
    </Toolbar>
  </AppBar>
  );
}

export default CustomAppBar;
