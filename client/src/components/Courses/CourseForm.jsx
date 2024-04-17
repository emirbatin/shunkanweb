import React, { useState, useEffect } from "react";
import { useCoursesContext } from "../../hooks/useCoursesContext";

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

    const res = await fetch("/api/courses", {
      method: "POST",
      body: JSON.stringify(course),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
    }

    if (res.ok) {
      setTitle("");
      setDescription("");
      setMinimumSkill("");
      setError(null);
      console.log(data);
      dispatch({ type: "CREATE_COURSE", payload: data });
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
