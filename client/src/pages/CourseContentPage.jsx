import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const FirstCoursePage = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [question, setQuestion] = useState(null);

  const getButtonName = () =>
    activeIndex < tabContents.length - 1 ? "Next" : "Finish";
  const tabContents = ["İçerik 1", "İçerik 2"];

  const renderContent = (index) => {
    switch (index) {
      case 0:
        return (
          <div className="">
            {question && question.mediaType === "image" ? (
              <img
                src={`localhost:4000/${question.mediaPath}`}
                alt="Question media"
                style={{ width: "100%", height: "auto" }}
              />
            ) : question && question.mediaType === "video" ? (
              <video
                src={`localhost:4000/${question.mediaPath}`}
                controls
                style={{ width: "100%", height: "auto" }}
              />
            ) : null}
          </div>
        );
      default:
        return <div style={{ color: "green", fontSize: "20px" }}>{tabContents[index]}</div>;
    }
  };

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then((response) => response.json())
      .then((data) => {
        setCourse(data);
      })
      .catch((error) => console.error("Error fetching course details:", error));
  }, [courseId]);

  useEffect(() => {
    if (course && course.questions && course.questions[activeIndex]) {
      const questionId = course.questions[activeIndex];
      fetch(`/api/questions/${questionId}`)
        .then((response) => response.json())
        .then((data) => {
          setQuestion(data);
          setMediaPath(data.mediaPath);
        })
        .catch((error) =>
          console.error("Error fetching question details:", error)
        );
    }
  }, [course, activeIndex]);

  if (!course) return <div>Loading course details...</div>;
  if (!question) return <div>Loading question details...</div>;

  return (
    <div className="flex flex-col h-screen w-screen p-[8rem]">
      <div className="flex flex-row">
        <div className="flex flex-grow w-20 items-end justify-end text-left px-10">
          {renderContent(activeIndex)}
        </div>
        <div className="flex flex-grow w-20 items-start justify-start text-start px-10">
          <div className="flex flex-col w-full">
            <h1>{question.id}</h1>
            <Typography variant="h5">{course.title}</Typography>
            <Typography variant="h7">{course.description}</Typography>
            <div className="flex flex-row content-between justify-between">
              <Typography variant="subtitle2">
                {question.questionText}
              </Typography>
              <Typography variant="subtitle2">
                {question.points} {t("point")}
              </Typography>
            </div>
            <div className="flex flex-col py-6">
              {question.options && question.options.length > 0 ? (
                question.options.map((options, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    style={{ margin: 10 }}
                  >
                    <Typography variant="subtitle2">{`${String.fromCharCode(
                      65 + index
                    )} - ${options}`}</Typography>
                  </Button>
                ))
              ) : (
                <Typography variant="subtitle2">
                  No answers available.
                </Typography>
              )}
            </div>
          </div>
        </div>
      </div>
      <br />
      <button
        onClick={() =>
          setActiveIndex((prevIndex) => Math.max(0, prevIndex - 1))
        }
        style={{ marginLeft: "10px" }}
      >
        <Typography variant="subtitle1">Back</Typography>
      </button>
      <button
        onClick={() => {
          if (activeIndex < tabContents.length - 1) {
            setActiveIndex(activeIndex + 1);
          } else {
            navigate("/courses");
          }
        }}
        style={{ marginLeft: "10px" }}
      >
        <Typography variant="subtitle1">{getButtonName()}</Typography>
      </button>
    </div>
  );
};

export default FirstCoursePage;
