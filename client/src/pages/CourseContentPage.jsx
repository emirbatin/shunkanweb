import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import {jwtDecode} from "jwt-decode"; // Correct usage
import LottieAnimation from "../components/LootieAnimation/lootieAnimation.jsx";
import LoadingLootie from "../assets/lottie/Manwithglassessittingonmonitorandlookingup.json";
import {
  fetchUserDetails,
  fetchCourseDetails,
  fetchQuestionDetails,
  saveWrongAnswers,
  addCoursePoints
} from "../api"; // Import API functions

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
  const [finishTriggered, setFinishTriggered] = useState(false); // New state

  const userToken = sessionStorage.getItem("token") || localStorage.getItem("token");

  useEffect(() => {
    console.log("Token:", userToken);
    if (userToken) {
      const data = jwtDecode(userToken);
      fetchUserDetails(data.id)
        .then(userData => console.log(t("User Details:"), userData))
        .catch(error => console.error(t("Error fetching user details:"), error));
    }
  }, [userToken, t]);

  const fetchCourse = useCallback(async (courseId) => {
    setLoadingCourse(true);
    try {
      const courseData = await fetchCourseDetails(courseId);
      setCourse(courseData);
      setTabContents(courseData.questions.map((_, index) => `${t("Content")} ${index + 1}`));
    } catch (error) {
      console.error(t("Error fetching course details:"), error);
    } finally {
      setLoadingCourse(false);
    }
  }, [t]);

  const fetchQuestion = useCallback(async (questionId, index) => {
    console.log("API URL:", process.env.REACT_APP_API_URL);
    setLoadingQuestion(true);
    try {
      const questionData = await fetchQuestionDetails(questionId);
      const mediaUrl = `${process.env.REACT_APP_API_URL}/${questionData.mediaPath}`;
      setQuestion({ ...questionData, mediaUrl });
      setTabContents((prevTabContents) => {
        const updatedTabContents = [...prevTabContents];
        updatedTabContents[index] = mediaUrl;
        return updatedTabContents;
      });
    } catch (error) {
      console.error(t("Error fetching question details:"), error);
    } finally {
      setLoadingQuestion(false);
    }
  }, [t]);

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
        setFinishTriggered(true); // Finish triggered
      } else {
        handleNextQuestion();
      }
    }
  }, [selectedOption, question, isLastQuestion]);

  const handleFinish = useCallback(async () => {
    if (userToken) {
      const data = jwtDecode(userToken);
      const userId = data.id;
      try {
        // Save wrong answers
        await saveWrongAnswers(userId, wrongAnswers);
        console.log(t("Answers saved successfully"));

        // Update user points
        await addCoursePoints(userId, totalPoints);
        console.log(t("Points added successfully"));
      } catch (error) {
        console.error(t("Error saving answers or adding points:"), error);
      }
    }
    navigate("/courses");
  }, [navigate, userToken, wrongAnswers, totalPoints, t]);

  useEffect(() => {
    if (finishTriggered) {
      handleFinish();
    }
  }, [finishTriggered, totalPoints, handleFinish]); // Call handleFinish when finishTriggered or totalPoints changes

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
      setFinishTriggered(true); // Finish triggered
    }
  }, [question, isLastQuestion, handleNextQuestion]);

  const renderContent = (index) => {
    let mediaUrl = index === 0 ? question?.mediaUrl : tabContents[index];

    return (
      <div className="flex h-80 w-80 object-fill">
        {mediaUrl ? (
          <>
            {question && question.mediaType === "image" ? (
              <img
                src={mediaUrl}
                alt={t("Question media")}
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
            {t("No media available")}
          </div>
        )}
      </div>
    );
  };

  const getOptionContent = (option) => option?.description || t("No option");

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
    return <div>{t("coursesnotfound")}</div>;
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
                <Typography variant="h1">{t("No answers available")}</Typography>
              )}
            </div>
            {/* Display total points */}
            <Typography variant="h6" style={{ marginTop: "20px" }}>
              {t("Total Points")}: {totalPoints}
            </Typography>
          </div>
        </div>
      </div>

      {/* Display wrong answers (if necessary) */}
      {/* 
      <Typography variant="h6">{t("Wrong Answers")}:</Typography>
      {wrongAnswers.map((wrongAnswer, index) => (
        <Typography key={index} variant="body1">
          {t("Correct Answer")}: {wrongAnswer.correctAns}, {t("Your Answer")}:{" "}
          {wrongAnswer.selectedAns !== null
            ? wrongAnswer.selectedAns
            : t("Skipped")}
        </Typography>
      ))}
      */}

      <div className="flex flex-row fixed bottom-8 left-0 right-0 w-full px-40">
        <div className="flex w-full">
          <div className="flex flex-grow justify-start">
            {!isAnswerCorrect && (
              <Typography variant="body1" color="error">
                {t("The answer is wrong, correct answer is")}:{" "}
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
                  {t("Skip")}
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
                ? t("Finish")
                : showFeedback
                ? t("Next")
                : t("Check Answer")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentPage;
