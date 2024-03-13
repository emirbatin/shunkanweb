import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import "./LanguageSelector.css";

const languages = [
  { code: "en", name: "English", icon: "🇬🇧" },
  { code: "tr", name: "Türkçe", icon: "🇹🇷" },
  { code: "jp", name: "日本語", icon: "🇯🇵" },
  { code: "rus", name: "Pусский", icon: "🇷🇺" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="large"
      >
        <LanguageIcon className="icon" />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {languages.map((lng) => (
          <MenuItem key={lng.code} onClick={() => changeLanguage(lng.code)}>
            <ListItemIcon className="listItemIcon">
              <Avatar className="transparentAvatar">{lng.icon}</Avatar>
            </ListItemIcon>
            <div className="languageName">{lng.name}</div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LanguageSelector;
