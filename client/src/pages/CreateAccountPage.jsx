import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SectionChooseLanguage from "../components/Sections/Choose Language/ChooseLanguage";
import SectionIntroduceYourself from "../components/Sections/Introduce Yourself/IntroduceYourself";
import SectionCameraAccess from "../components/Sections/Camera Access/CameraAccess";
import SectionRegisterPage from "../components/Sections/Register/RegisterPage";
import SectionChoosePlan from "../components/Sections/Choose Plan/ChoosePlan";
import LanguageContext from "../context/LanguageContext"; // Context'i import edin

const CreateAccountPage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const totalSections = 5;
  const [progress, setProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [userInfo, setUserInfo] = useState({
    language: "",
    name: "",
    username: "",
    email: "",
    password: "",
    termandCondition: false,
    cameraAccess: false,
    plan: ["free", "premium"],
  });

  const handleLanguageSelect = (language) => {
    setUserInfo((prevState) => ({
      ...prevState,
      language: language,
    }));
  };

  const handleNameChange = (name) => {
    setUserInfo((prevState) => ({
      ...prevState,
      name: name,
    }));
  };

  const handleCreateAccount = (key, value) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleCameraAccess = (cameraAccess) => {
    setUserInfo((prevState) => ({
      ...prevState,
      cameraAccess: cameraAccess,
    }));
  };

  const handlePlanSelect = (plan) => {
    setUserInfo((prevState) => ({
      ...prevState,
      plan: [plan],
    }));
  };

  useEffect(() => {
    const newProgress = (currentSection / (totalSections - 1)) * 100;
    setProgress(newProgress);
  }, [currentSection, totalSections]);

  const goToNextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  // İsteğe bağlı olarak, son section için geriye gitme işlevi ekleyebilirsiniz.
  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <SectionChooseLanguage
            onLanguageSelect={handleLanguageSelect}
            goToNextSection={goToNextSection}
          />
        );
      case 1:
        return (
          <SectionIntroduceYourself
            onUserName={handleNameChange}
            goToNextSection={goToNextSection}
          />
        );
      case 2:
        return (
          <SectionRegisterPage
            onCreateAccount={(username, email, password, termandCondition) =>
              handleCreateAccount(username, email, password, termandCondition)
            }
            goToNextSection={goToNextSection}
          />
        );

      case 3:
        return (
          <SectionCameraAccess
            onCameraAccess={handleCameraAccess}
            goToNextSection={goToNextSection}
          />
        );
      case 4:
        return (
          <SectionChoosePlan
            onPlanSelect={handlePlanSelect}
            goToNextSection={goToNextSection}
            userInfo={userInfo} // Bu satırı ekleyin
          />
        );
      default:
        return <div>Unknown section</div>;
    }
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      <div>
        {/* Progress Bar Container */}
        <div class="flex w-1/2 justify-start items-start mx-auto">
          <div className="relative w-full h-5 bg-rose-100 rounded-xl">
            <div
              class="absolute h-full transition-width rounded-lg"
              style={{
                width: `${progress}%`,
                backgroundColor: "var(--button-color)",
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div>
        </div>
        {/*
        <p>
          Language: {userInfo.language}, Name: {userInfo.name}, Username:{" "}
          {userInfo.username}, Email: {userInfo.email}, Terms and Conditions
          Accepted: {userInfo.termandCondition ? "Yes" : "No"}, Camera Access:{" "}
          {userInfo.cameraAccess ? "Granted" : "Denied"}, Plan:{userInfo.plan} ,
        </p>        
        */}

        {renderCurrentSection()}
      </div>
    </LanguageContext.Provider>
  );
};

export default CreateAccountPage;
