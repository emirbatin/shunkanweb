import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import LottieAnimation from "../components/LootieAnimation/lootieAnimation.jsx";
import LoadingLootie from "../assets/lottie/Manwithglassessittingonmonitorandlookingup.json";

const CourseContentPage = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [course, setCourse] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [tabContents, setTabContents] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0); 
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(true);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [finishTriggered, setFinishTriggered] = useState(false); // Yeni state

  const userToken = sessionStorage.getItem("token") || localStorage.getItem("token");

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      console.log("User Details:", data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    console.log("Token:", userToken);
    if (userToken) {
      const data = jwtDecode(userToken);
      fetchUserDetails(data.id);
    }
  }, [userToken]);

  const fetchCourse = useCallback(async (courseId) => {
    setLoadingCourse(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      setCourse(data);
      setTabContents(data.questions.map((_, index) => `İçerik ${index + 1}`));
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoadingCourse(false);
    }
  }, []);

  const fetchQuestion = useCallback(async (questionId, index) => {
    setLoadingQuestion(true);
    try {
      const response = await fetch(`/api/questions/${questionId}`);
      const data = await response.json();
      const mediaUrl = `http://localhost:4000/${data.mediaPath}`;
      setQuestion({ ...data, mediaUrl });
      setTabContents((prevTabContents) => {
        const updatedTabContents = [...prevTabContents];
        updatedTabContents[index] = mediaUrl;
        return updatedTabContents;
      });
    } catch (error) {
      console.error("Error fetching question details:", error);
    } finally {
      setLoadingQuestion(false);
    }
  }, []);

  useEffect(() => {
    fetchCourse(courseId);
  }, [courseId, fetchCourse]);

  useEffect(() => {
    if (course && course.questions && course.questions[activeQuestionIndex]) {
      const questionId = course.questions[activeQuestionIndex];
      fetchQuestion(questionId, activeQuestionIndex);
    }
    setIsLastQuestion(
      course && activeQuestionIndex === course.questions.length - 1
    );
  }, [course, activeQuestionIndex, fetchQuestion]);

  const handleOptionClick = useCallback((index) => {
    setSelectedOption(index);
  }, []);

  const handleCheckAnswer = useCallback(() => {
    let userAnswer = null;
    let correctAnswer = question?.options.find(
      (option) => option.label === question.correctAnswer
    )?.description;

    if (selectedOption !== null) {
      userAnswer = question.options[selectedOption]?.description;
    }

    if (userAnswer !== correctAnswer) {
      setWrongAnswers((prev) => [
        ...prev,
        { correctAns: correctAnswer, selectedAns: userAnswer },
      ]);
      setShowFeedback(true);
      setIsAnswerCorrect(false);
    } else {
      setIsAnswerCorrect(true);
      setShowFeedback(false);
      setTotalPoints((prevPoints) => prevPoints + question.points); // Increment total points

      if (isLastQuestion) {
        setFinishTriggered(true); // Finish işlemi tetiklendi
      } else {
        handleNextQuestion();
      }
    }
  }, [selectedOption, question, isLastQuestion]);

  useEffect(() => {
    if (finishTriggered) {
      handleFinish();
    }
  }, [finishTriggered, totalPoints]); // finishTriggered veya totalPoints değiştiğinde handleFinish fonksiyonunu çağır

  const handleNextQuestion = useCallback(() => {
    if (!isLastQuestion) {
      setActiveQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setIsAnswerCorrect(true);
    }
  }, [isLastQuestion]);

  const handleSkip = useCallback(() => {
    let correctAnswer = question?.options.find(
      (option) => option.label === question.correctAnswer
    )?.description;
    setWrongAnswers((prev) => [
      ...prev,
      { correctAns: correctAnswer, selectedAns: null },
    ]);

    if (!isLastQuestion) {
      handleNextQuestion();
    } else {
      setFinishTriggered(true); // Finish işlemi tetiklendi
    }
  }, [question, isLastQuestion, handleNextQuestion]);

  const handleFinish = useCallback(async () => {
    if (userToken) {
      const data = jwtDecode(userToken);
      const userId = data.id;
      try {
        // Yanlış cevapları kaydet
        const response = await fetch(`/api/users/${userId}/addWrongAnswers`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wrongAnswers }),
        });
        if (response.ok) {
          console.log("Answers saved successfully");
        } else {
          console.error("Failed to save answers");
        }

        // Kullanıcı puanlarını güncelle
        const pointsResponse = await fetch(`/api/users/${userId}/addCoursePoints`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ points: totalPoints }),
        });
        if (pointsResponse.ok) {
          console.log("Points added successfully");
        } else {
          console.error("Failed to add points");
        }
      } catch (error) {
        console.error("Error saving answers or adding points:", error);
      }
    }
    navigate("/courses");
  }, [navigate, userToken, wrongAnswers, totalPoints]);

  const renderContent = (index) => {
    let mediaUrl = index === 0 ? question?.mediaUrl : tabContents[index];

    return (
      <div className="flex h-80 w-80 object-fill">
        {mediaUrl ? (
          <>
            {question && question.mediaType === "image" ? (
              <img
                src={mediaUrl}
                alt="Question media"
                style={{ width: "100%", height: "auto" }}
              />
            ) : question && question.mediaType === "video" ? (
              <video
                src={mediaUrl}
                controls
                style={{ width: "100%", height: "auto" }}
              />
            ) : null}
          </>
        ) : (
          <div style={{ color: "white", fontSize: "20px" }}>
            No media available
          </div>
        )}
      </div>
    );
  };

  const getOptionContent = (option) => option?.description || "Seçenek Yok";

  if (loadingCourse || loadingQuestion) {
    return (
      <div className="flex flex-col text-center items-center justify-center h-screen w-auto">
        <div className="flex w-80 h-auto pb-40">
          <LottieAnimation animationData={LoadingLootie} />
        </div>
      </div>
    );
  }

  if (!course || !question) {
    return <div>Error: Course or Question not found.</div>;
  }

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
                    variant={
                      selectedOption === index ? "contained" : "outlined"
                    }
                    style={{ margin: 10 }}
                    onClick={() => handleOptionClick(index)}
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
            {/* Display total points */}
            <Typography variant="h6" style={{ marginTop: "20px" }}>
              Toplam Puan: {totalPoints}
            </Typography>
          </div>
        </div>
      </div>

      {/* Yanlış Cevap Verilerini Ekrana Yazdırılması */}

      {/* 
      <Typography variant="h6">Yanlış Cevaplar:</Typography>
      {wrongAnswers.map((wrongAnswer, index) => (
        <Typography key={index} variant="body1">
          Doğru Cevap: {wrongAnswer.correctAns}, Seçtiğiniz Cevap:{" "}
          {wrongAnswer.selectedAns !== null
            ? wrongAnswer.selectedAns
            : "Boş Geçildi"}
        </Typography>
      ))}
      */}

      <div className="flex flex-row fixed bottom-8 left-0 right-0 w-full px-40">
        <div className="flex w-full">
          <div className="flex flex-grow justify-start">
            {!isAnswerCorrect && (
              <Typography variant="body1" color="error">
                Cevap yanlış, doğru cevap:{" "}
                {wrongAnswers[wrongAnswers.length - 1]?.correctAns}
              </Typography>
            )}
            {!showFeedback &&
              activeQuestionIndex < course?.questions?.length - 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: 10 }}
                  onClick={handleSkip}
                >
                  Skip
                </Button>
              )}
          </div>
          <div className="flex flex-grow justify-end">
            <Button
              variant="contained"
              color="primary"
              style={{ margin: 10 }}
              onClick={
                showFeedback
                  ? isLastQuestion
                    ? () => setFinishTriggered(true)
                    : handleNextQuestion
                  : handleCheckAnswer
              }
            >
              {isLastQuestion && showFeedback
                ? "Bitir"
                : showFeedback
                ? "Sonraki"
                : "Kontrol Et"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentPage;
