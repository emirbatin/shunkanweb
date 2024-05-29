import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../Language Selector/language-selector";
import ThemeSelector from "../Change Theme/ChangeTheme.jsx";

function CustomAppBar({ showIconButton, showThemeButton }) {
  const { t } = useTranslation();

  return (
    <AppBar className="Appbar" position="static">
      <Toolbar>
        {showIconButton && (
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        )}
        {showThemeButton && <ThemeSelector />}

        <Typography className="pl-5" variant="h5">
          <Link to="/courses" style={{ color: "inherit", textDecoration: "none" }}>
            {t("appTitle")}
          </Link>
        </Typography>
        <LanguageSelector />
      </Toolbar>
    </AppBar>
  );
}

export default CustomAppBar;
