import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Section4 = ({ onCameraAccess, goToNextSection }) => {
  const { t } = useTranslation();
  const [isCameraOn, setIsCameraOn] = useState(
    localStorage.getItem("cameraAccess") === "true" // Set initial state from localStorage
  );
  const videoRef = useRef(null);
  const [cameraAccess, setCameraAccess] = useState(false);

  const handleCameraAccessChange = (event) => {
    setCameraAccess(event.target.checked);
    onCameraAccess(event.target.checked);
    console.log("cameraAccess: ", event.target.checked);
  };

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
    <div className="flex flex-row items-center justify-center h-screen w-auto pb-28">
      <div className="flex items-center justify-center mr-12">
        <div className="flex w-80 h-80 bg-gray-700 rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg"
          ></video>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center w-80 h-80 rounded-lg">
        <label
          className="flex flex-row items-center"
          htmlFor="cameraAccessCheckbox"
        >
          <input
            id="cameraAccessCheckbox"
            type="checkbox"
            checked={isCameraOn}
            onChange={(event) => {
              setIsCameraOn(!isCameraOn);
              handleCameraAccessChange(event);
            }}
            className="w-6 h-6 mt-2"
          />
          <Typography variant="h5" style={{paddingLeft:10}}>
            {t("Allow camera access")}
          </Typography>
        </label>
        <p className="text-left my-4">
          Access to your camera will help improve our artificial intelligence
          system's accuracy and enhance your learning experience by providing
          more personalized and effective interactions.
        </p>
        <Button
          className="nextSectionButton"
          variant="contained"
          onClick={handleNextSectionClick}
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};
export default Section4;
