import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./CameraAccess.css";
import Button from "@mui/material/Button";

const Section4 = ({ goToNextSection }) => {
  const { t } = useTranslation();
  const [isCameraOn, setIsCameraOn] = useState(
    localStorage.getItem("cameraAccess") === "true" // Set initial state from localStorage
  );
  const videoRef = useRef(null);

  useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing the camera:", err);
          setIsCameraOn(false); // Reset the checkbox if access is denied or fails
        });
    } else {
      // Checkbox işaretli değilse local'e kaydetmeyecek ve kamera kapalı kalacak
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        localStorage.setItem("cameraAccess", "false");
      }
    }

    return () => {
      // Cleanup function to stop the video stream when the component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        localStorage.setItem("cameraAccess", "false");
      }
    };
  }, [isCameraOn]); // This effect depends on isCameraOn state

  const handleNextSectionClick = () => {
    // Checkbox işaretli ise ve butona tıklanırsa local'e izin verildi olarak kaydedilecek
    // Kamera kapanacak.
    if (isCameraOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      localStorage.setItem("cameraAccess", "true");
      goToNextSection();
    } else {
      // Kamera erişimine izin vermezse hata mesajı gösterilecek
      alert("You need to allow camera access to proceed!");
    }
  };

  return (
    <div className="camera-access-container">
      <div className="camera-preview">
        <div className="cameraView">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          ></video>
        </div>
      </div>
      <div className="cameraAccessPermission">
        <label className="cameraAccessLabel" htmlFor="cameraAccessCheckbox">
          <input
            id="cameraAccessCheckbox"
            type="checkbox"
            checked={isCameraOn}
            onChange={() => setIsCameraOn(!isCameraOn)}
          />
          <h2 className="cameraAccessLabel">{t("Allow camera access")}</h2>
        </label>
        <p className="textForPerm">
          Access to your camera will help improve our artificial intelligence
          system's accuracy and enhance your learning experience by providing
          more personalized and effective interactions.
        </p>
        <Button
        className="nextSectionButton"
        variant="contained"
        type="button"
        onClick={handleNextSectionClick}>
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};

export default Section4;
