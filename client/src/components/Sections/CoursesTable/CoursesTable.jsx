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
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const CoursesTable = ({ courses }) => {
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

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography variant="h6" className="text-2xl font-bold mb-4 text-left">
          Courses
        </Typography>
        <Tooltip title={"Add new course"}>
          <IconButton color="primary" href="">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
      <br />
      <TextField
        label="Search by Name"
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
              <TableCell>Thumbnail</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Minimum Skill</TableCell>
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
                <TableCell>{course.minimumSkill}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CoursesTable;
