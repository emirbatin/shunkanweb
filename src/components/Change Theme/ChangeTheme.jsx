import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Dark mode icon
import LightModeIcon from '@mui/icons-material/LightMode'; // Light mode icon
import Brightness4Icon from '@mui/icons-material/Brightness4'; // System default icon (for auto theme)
import './ChangeTheme.css';

const ThemeSelector = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  // Kullanıcının tema ikonuna tıkladığında çağrılacak fonksiyon
  const handleClick = () => {
    setTheme(prevTheme => {
      switch (prevTheme) {
        case 'system':
          return 'light';
        case 'light':
          return 'dark';
        case 'dark':
          return 'system';
        default:
          return 'system';
      }
    });
  };

  useEffect(() => {
    const applyTheme = (themeValue) => {
      if (themeValue === 'system') {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
      } else {
        document.body.setAttribute('data-theme', themeValue);
      }
      localStorage.setItem('theme', themeValue);
    };

    applyTheme(theme);

    const themeWatcher = window.matchMedia('(prefers-color-scheme: dark)');
    const themeListener = (e) => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    themeWatcher.addEventListener('change', themeListener);

    return () => {
      themeWatcher.removeEventListener('change', themeListener);
    };
  }, [theme]);

  let Icon;
  switch (theme) {
    case 'system':
      Icon = Brightness4Icon;
      break;
    case 'light':
      Icon = LightModeIcon; 
      break;
    case 'dark':
      Icon = DarkModeIcon;
      break;
    default:
      Icon = Brightness4Icon;
  }


  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <Icon className='iconColor'/>
    </div>
  );
};

export default ThemeSelector;
