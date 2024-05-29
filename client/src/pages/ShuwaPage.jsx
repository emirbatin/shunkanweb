import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar/Sidebar";
import { useTranslation } from "react-i18next";
import {
  connectSocket,
  disconnectSocket,
  onSocketConnect,
  onSocketDisconnect,
  onSentenceUpdate,
  offSocketConnect,
  offSocketDisconnect,
  offSentenceUpdate,
  getVideoFeedUrl,
} from "../api";

const ShuwaPage = () => {
  const { t } = useTranslation();
  const targetWords = ["hello", "howareyou", "thanks"]; // Hedef kelimeler dizisi
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // Mevcut hedef kelimenin indeksi
  const [sentence, setSentence] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(10); // 10 saniyelik süre
  const [correctSignDetected, setCorrectSignDetected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false); // Current level completion status

  const targetWord = targetWords[currentWordIndex]; // Mevcut hedef kelime

  useEffect(() => {
    let timer;
    let timeout;

    if (isConnected) {
      // 10 saniyelik zamanlayıcı başlatma
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          return 0;
        });
      }, 1000);

      // Zamanlayıcı bittiğinde işareti kontrol etme
      timeout = setTimeout(() => {
        if (!correctSignDetected) {
          setFeedback(t("wronganswer"));
        }
        setIsConnected(false); // Disconnect client when time is up
        setIsLevelCompleted(true); // Mark level as completed
      }, 10000); // 10 saniye

      connectSocket();

      onSocketConnect(() => {
        console.log(t("Connected to server"));
      });

      onSentenceUpdate((data) => {
        setSentence(data.sentence);
        if (data.sentence === targetWord) {
          setCorrectSignDetected(true);
          setFeedback(t("correctanswer"));
          setIsConnected(false); // Correct sign detected, disconnect client
          setIsLevelCompleted(true); // Mark level as completed
        } else {
          setCorrectSignDetected(false);
        }
      });

      onSocketDisconnect(() => {
        console.log(t("Disconnected from server"));
      });
    } else {
      disconnectSocket();
      setTimeLeft(10);
      setSentence("");
      setCorrectSignDetected(false);
      // feedback'i burada resetlemiyoruz
    }

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
      offSocketConnect();
      offSentenceUpdate();
      offSocketDisconnect();
      disconnectSocket(); // Ensure the socket disconnects when the component unmounts
    };
  }, [isConnected, targetWord, t, correctSignDetected]);

  useEffect(() => {
    if (timeLeft === 0 && !correctSignDetected) {
      setFeedback(t("wronganswer"));
      setIsLevelCompleted(true); // Mark level as completed
    }
  }, [timeLeft, correctSignDetected, t]);

  const handleButtonClick = () => {
    if (isLevelCompleted) {
      // Go to the next level
      if (currentWordIndex < targetWords.length - 1) {
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      } else {
        setCurrentWordIndex(0); // Loop back to the first word
      }
      setIsLevelCompleted(false); // Reset level completion status
      setFeedback(""); // Reset feedback for the next level
    } else {
      // Start the current level
      setIsConnected((prev) => !prev);
      setFeedback(""); // feedback'i bağlantı durumu değiştiğinde sıfırlıyoruz
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar />
      <div className="flex flex-row w-full items-center justify-center mr-72">
        <div className="flex flex-grow justify-end mr-20">
          <img
            className="flex w-80 h-80 object-cover"
            id="video_feed"
            src={getVideoFeedUrl(isConnected)}
            alt="Video Stream"
          />
        </div>
        <div className="flex flex-col flex-grow justify-start items-start text-start">
          <Typography variant="h5">{t("Target")}: {t(targetWord)}</Typography>
          <br />
          <div id="sentence">{sentence}</div>
          <div id="timer">{t("Time Left")}: {timeLeft} {t("seconds")}</div>
          {feedback && <div id="feedback">{feedback}</div>}
          <br />
        </div>
      </div>
      <div className="flex flex-row fixed bottom-8 left-0 right-0 w-full px-40 pl-80">
        <div className="flex w-full">
          <div className="flex flex-grow justify-start">
            {feedback && <Typography variant="h6">{feedback}</Typography>}
          </div>
          <div className="flex flex-grow justify-end">
            <Button
              className="w-40 h-auto"
              variant="contained"
              onClick={handleButtonClick}
            >
              {isLevelCompleted ? t("Next") : isConnected ? t("Finish") : t("Start")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShuwaPage;
