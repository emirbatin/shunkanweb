import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import SvgIcon from "@mui/material/SvgIcon";
import Icon from "@mui/material/Icon";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VideocamIcon from "@mui/icons-material/Videocam";
import "./SelectCoursePage.css";

const SelectCoursePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "Lesson 1",
      description: "Lorem ipsum dolor sit amet.",
      hours: 2,
      imageUrl: "https://via.placeholder.com/150",
      navigateTo: "/lesson1",
    },
    {
      id: 2,
      title: "Lesson 2",
      description: "Lorem ipsum dolor sit amet.",
      hours: 2,
      imageUrl: "https://via.placeholder.com/150",
      navigateTo: "/lesson2",
    },
    {
      id: 3,
      title: "Lesson 3",
      description: "Lorem ipsum dolor sit amet.",
      hours: 2,
      imageUrl: "https://via.placeholder.com/150",
      navigateTo: "/lesson3",
    },
    {
      id: 4,
      title: "Lesson 4",
      description: "Lorem ipsum dolor sit amet.",
      hours: 2,
      imageUrl: "https://via.placeholder.com/150",
      navigateTo: "/lesson4",
    },
    // Add more lessons as needed
  ]);

  // Rotalama işlevini tetiklemek için kullanılacak yöntem
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div>
      <div className="courses-container">
        <div className="container-left">
          <div className="user-profile-container">
            <div className="user-profile">
              <img
                className="user-profile-picture"
                src="https://via.placeholder.com/150"
                alt="user"
              />
              <div className="user-info">
                <h3 className="username">Username</h3>
                <h4 className="user-perm">Student</h4>
              </div>
            </div>
          </div>

          <br />

          <div className="sidebar-menu-items">
            <ul>
              <li>
                <Link className="route-link" to="/home">
                  Home
                </Link>
              </li>
              <br />
              <li>
                <Link className="route-link" to="/courses">
                  Courses
                </Link>
              </li>
              <br />
              <li>
                <Link className="route-link" to="/profile">
                  Profile
                </Link>
              </li>
              <br />
              <li>
                <Link className="route-link" to="/settings">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-logout">
            <Button
              className="logout-button"
              variant="contained"
              startIcon={<LogoutIcon />}
              type="button"
              onClick={() => handleNavigate("/")}
            >
              {t("logout")}
            </Button>
          </div>
        </div>
        <div className="container-right">
          <div className="courses-title-container">
            <MenuBookIcon className="courses-title-icon" />
            <h1 className="courses-title">{t("selectcourses")}</h1>
          </div>

          <div className="courses-lessons-cards">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="lesson-card">
                <div className="lesson-image">
                  <img
                    className="lesson-image"
                    src={lesson.imageUrl}
                    alt="lesson"
                  />
                </div>
                <h3 className="lesson-title">{lesson.title}</h3>
                <p className="lesson-desc">{lesson.description}</p>
                <div className="lesson-hours">
                  <SvgIcon className="lesson-hours-label-icon">
                    <VideocamIcon />
                  </SvgIcon>
                  <p className="lesson-hours-text">Hours: {lesson.hours}</p>
                </div>
                <br />
                <div className="lesson-card-button-container">
                  <Button
                    className="lesson-button"
                    variant="text"
                    type="button"
                    onClick={() => handleNavigate(lesson.navigateTo)}
                  >
                    {t("startlesson")}
                  </Button>
                </div>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCoursePage;
