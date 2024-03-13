import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./CreateAccountPage.css";
import SectionChooseLanguage from "../../components/Sections/Choose Language/ChooseLanguage";
import SectionIntroduceYourself from "../../components/Sections/Introduce Yourself/IntroduceYourself";
import CameraAccess from "../../components/Sections/Camera Access/CameraAccess";

const CreateAccountPage = () => {
  const [currentSection, setCurrentSection] = useState(0); // İlk section 0 indeksli olduğu için 0'dan başlatıyoruz.
  const totalSections = 5; // Toplam section sayısı

  const [progress, setProgress] = useState(0);

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
        return <SectionChooseLanguage goToNextSection={goToNextSection} />;
      case 1:
        return <SectionIntroduceYourself goToNextSection={goToNextSection} />;
      case 2:
        return <SectionIntroduceYourself goToNextSection={goToNextSection} />;
      case 3:
        return <CameraAccess goToNextSection={goToNextSection} />;
      case 4:
        return <SectionIntroduceYourself goToNextSection={goToNextSection} />;
      default:
        return <div>Unknown section</div>;
    }
  };

  return (
    <div>
      <div className="progressBarContainer">
        <div className="progressBarBackground">
          <div className="progressBar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      {renderCurrentSection()}
    </div>
  );
};

export default CreateAccountPage;
