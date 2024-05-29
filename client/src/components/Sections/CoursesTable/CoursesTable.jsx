import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CoursesTable = ({ courses }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(courses);

  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCourses(
      courses.filter((course) => course.title.toLowerCase().includes(term))
    );
  };

  const handleClick = () => {
    navigate("/add-new-course");
    console.log(t("Add new course clicked"));
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography variant="h6" className="text-2xl font-bold mb-4 text-left">
          {t("courses")}
        </Typography>
        <Tooltip title={t("Add new course")}>
          <IconButton color="primary" onClick={handleClick}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
      <br />
      <TextField
        label={t("Search by Name")}
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />

      <TableContainer component={Paper} className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("thumbnail")}</TableCell>
              <TableCell>{t("id")}</TableCell>
              <TableCell>{t("title")}</TableCell>
              <TableCell>{t("minimum skill")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>
                  {course.imageUrl && (
                    <img
                      src={course.imageUrl}
                      alt={course.courseText}
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </TableCell>
                <TableCell>{course._id}</TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{t(course.minimumSkill)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CoursesTable;
