import { CourseContext } from "../context/CourseContext";
import { useContext } from "react";

const useCoursesContext = () => {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error(
      "useCoursesContext must be used within a CourseContextProvider"
    );
  }

  return context;
};

export { useCoursesContext };