import Button from "@mui/material/Button";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import { useTranslation } from "react-i18next";

const CourseDetails = ({ course }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  const formattedTitle = capitalizeFirstLetter(course.title);
  const formattedDescription = capitalizeFirstLetter(course.description);
  const formattedLevel = capitalizeFirstLetter(course.minimumSkill);

  return (
    <div>
      {/* Course Card*/}
      <div className="flex flex-col w-56 h-full rounded-xl bg-white text-start shadow-sm">
        <div key={course._id}></div>
        {/* Course Image */}
        <img
          className="w-full h-40 object-cover rounded-t-xl mb-2"
          src={course.imageUrl}
          alt={course.imageUrl}
        />
        {/* Course Details */}
        <div className="flex flex-col p-2">
          <Typography variant="h6" className="card-title">
            {t(formattedTitle)}
          </Typography>
          <Typography variant="subtitle1" className="card-description">
            {t(formattedDescription)}
          </Typography>
          <Typography variant="subtitle1" className="card-minimum-skill">
          {t("Level:")} {t(formattedLevel)}
          </Typography>
        </div>
        {/* Course Button */}
        <div className="flex w-full h-full items-end flex-row-reverse p-2">
          <Button
            className="course-button"
            variant="text"
            type="button"
            onClick={() => handleNavigate(`/course/${course._id}`)}
          >
            <Typography variant="subtitle1" className="course-button-text">
            {t("Start")}
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
