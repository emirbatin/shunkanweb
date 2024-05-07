import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import LottieAnimation from "../components/LootieAnimation/lootieAnimation.jsx";
import LoadingLootie from "../assets/lottie/Manwithglassessittingonmonitorandlookingup.json";


const FirstCoursePage = () => {
  const { t } = useTranslation();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [tabContents, setTabContents] = useState([]);

  // Course bilgilerini getiren fonksiyon
  const fetchCourse = async (courseId) => {
    setLoadingCourse(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      setCourse(data);
      // setTabContents'i kullanarak tabContents state'ini güncelle
      setTabContents(
        Array.from(
          { length: data.questions.length },
          (_, index) => `İçerik ${index + 1}`
        )
      );
      setLoadingCourse(false);
    } catch (error) {
      console.error("Error fetching course details:", error);
      setLoadingCourse(false);
    }
  };

  // Soru bilgilerini getiren fonksiyon

  const fetchQuestion = async (questionId, index) => {
    setLoadingQuestion(true);
    try {
      const response = await fetch(`/api/questions/${questionId}`);
      const data = await response.json();
      console.log(data); // API'den gelen veriyi konsola yazdır
      // Doğru mediaUrl değerini belirle
      const mediaUrl = `http://localhost:4000/${data.mediaPath}`;
      setQuestion({ ...data, mediaUrl }); // mediaUrl'i veriye ekle
      setLoadingQuestion(false);
      // Set mediaUrl for the corresponding tabContent
      setTabContents((prevTabContents) => {
        const updatedTabContents = [...prevTabContents];
        updatedTabContents[index] = mediaUrl; // Doğru mediaUrl'yi ekle
        return updatedTabContents;
      });
    } catch (error) {
      console.error("Error fetching question details:", error);
      setLoadingQuestion(false);
    }
  };

  // Sorunun içeriğini render etme fonksiyonu

  const renderContent = (index) => {
    switch (index) {
      case 0:
        console.log("Media URL:", question.mediaUrl);
        return (
          <div className="flex h-80 w-auto">
            {question && question.mediaType === "image" ? (
              <img
                src={question.mediaUrl}
                alt="Question media"
                style={{ width: "100%", height: "auto" }}
              />
            ) : question && question.mediaType === "video" ? (
              <video
                src={question.mediaUrl}
                controls
                style={{ width: "100%", height: "auto" }}
              />
            ) : null}
          </div>
        );
      default:
        return (
          <div
            className="flex h-80 w-auto"
            style={{ color: "white", fontSize: "20px" }}
          >
            {tabContents[index] && (
              <img
                src={tabContents[index]}
                alt={`Media ${index}`}
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </div>
        );
    }
  };

  // Her seçeneğin içeriğini almak için bir yardımcı fonksiyon
  const getOptionContent = (option) => {
    if (option && option.description) {
      return option.description;
    }
    return "Seçenek Yok";
  };


  useEffect(() => {
    fetchCourse(courseId);
  }, [courseId]);

  useEffect(() => {
    if (course && course.questions && course.questions[activeQuestionIndex]) {
      const questionId = course.questions[activeQuestionIndex];
      fetchQuestion(questionId);
    }
  }, [course, activeQuestionIndex]);

  const handleBack = () => {
    setActiveQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    if (activeQuestionIndex < tabContents.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else {
      navigate("/courses");
    }
  };

  useEffect(() => {
    if (course && course.questions && course.questions[activeQuestionIndex]) {
      const questionId = course.questions[activeQuestionIndex];
      fetchQuestion(questionId, activeQuestionIndex);
    }
  }, [course, activeQuestionIndex]);

  if (loadingCourse || loadingQuestion)
  return (
    <div className="flex flex-col text-center items-center justify-center h-screen w-auto">
      <div className="flex w-80 h-auto pb-40">
      <LottieAnimation animationData={LoadingLootie} />
      </div>
    </div>
  );

  if (!course || !question)
    return <div>Error: Course or Question not found.</div>;

  return (
    <div className="flex flex-col h-screen w-screen p-[8rem]">
      <div className="flex flex-row items-center">
        <div className="flex flex-grow w-20 items-end justify-end text-left px-10">
          {renderContent(activeQuestionIndex)}
        </div>
        <div className="flex flex-grow w-20 items-start justify-start text-start px-10">
          <div className="flex flex-col w-full">
            <h1>{question.id}</h1>
            <Typography variant="h5">
              {t(`${question.questionText}`)}
            </Typography>
            <div className="flex flex-row content-between justify-between">
              <Typography variant="subtitle2">{course.description}</Typography>
              <Typography variant="subtitle2">
                {question.points} {t("point")}
              </Typography>
            </div>
            <div className="flex flex-col py-6">
              {question.options && question.options.length > 0 ? (
                question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    style={{ margin: 10 }}
                  >
                    <Typography variant="text">{`${String.fromCharCode(
                      65 + index
                    )} - ${getOptionContent(option)}`}</Typography>
                  </Button>
                ))
              ) : (
                <Typography variant="h1">No answers available.</Typography>
              )}
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="flex flex-row justify-center text-center items-center">
        {activeQuestionIndex !== 0 && ( // Bir önceki içerik null değilse geri butonunu göster
          <button onClick={handleBack} style={{ marginRight: "50px" }}>
            <Typography variant="subtitle1">Back</Typography>
          </button>
        )}
        <button onClick={handleNext}>
          <Typography variant="subtitle1">
            {activeQuestionIndex < tabContents.length - 1 ? "Next" : "Finish"}
          </Typography>
        </button>
      </div>
    </div>
  );
};

export default FirstCoursePage;
