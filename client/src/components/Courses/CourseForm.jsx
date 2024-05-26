import React, { useState } from "react";
import { useCoursesContext } from "../../hooks/useCoursesContext";
import { createCourse } from "../../api"; // API fonksiyonunu içe aktarın

const CourseForm = () => {
  const { dispatch } = useCoursesContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minimumSkill, setMinimumSkill] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const course = {
      title,
      description,
      minimumSkill,
    };

    try {
      const data = await createCourse(course);
      setTitle("");
      setDescription("");
      setMinimumSkill("");
      setError(null);
      console.log(data);
      dispatch({ type: "CREATE_COURSE", payload: data });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form action="" className="courseForm" onSubmit={handleSubmit}>
        <h3>Add New Course</h3>
        <label> Title: </label>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Title"
        />
        <br />
        <label> Description: </label>
        <input
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Description"
        />
        <br />
        <label> Minimum Skill: </label>
        <input
          type="text"
          onChange={(e) => setMinimumSkill(e.target.value)}
          value={minimumSkill}
          placeholder="Minimum Skill"
        />
        <br />
        <button>Add Course</button>
        <br />
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default CourseForm;
