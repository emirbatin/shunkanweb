import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Button, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar/Sidebar";
import { useTranslation } from "react-i18next";

const socket = io(`${process.env.REACT_APP_FLASK_URL}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false, // Prevent auto-connection
});

const ShuwaPage = () => {
  const { t } = useTranslation();
  const targetWord = "konnichiwa"; // Hedef kelimeyi değişken içinde sakla
  const [sentence, setSentence] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(10); // 10 saniyelik süre
  const [correctSignDetected, setCorrectSignDetected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

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
          setFeedback("Yanlış cevap");
        }
        setIsConnected(false); // Disconnect client when time is up
      }, 10000); // 10 saniye

      socket.connect();

      socket.on("connect", () => {
        console.log("Connected to server");
      });

      socket.on("sentence_update", (data) => {
        setSentence(data.sentence);
        if (data.sentence === targetWord) {
          setCorrectSignDetected(true);
          setFeedback("Doğru cevap!");
          setIsConnected(false); // Correct sign detected, disconnect client
        } else {
          setCorrectSignDetected(false);
        }
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });
    } else {
      socket.disconnect();
      setTimeLeft(10);
      setSentence("");
      setCorrectSignDetected(false);
      // feedback'i burada resetlemiyoruz
    }

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
      socket.off("connect");
      socket.off("sentence_update");
      socket.off("disconnect");
      socket.disconnect(); // Ensure the socket disconnects when the component unmounts
    };
  }, [isConnected, targetWord]);

  useEffect(() => {
    if (timeLeft === 0 && !correctSignDetected) {
      setFeedback("Yanlış cevap");
    }
  }, [timeLeft, correctSignDetected]);

  const handleButtonClick = () => {
    setIsConnected((prev) => !prev);
    setFeedback(""); // feedback'i bağlantı durumu değiştiğinde sıfırlıyoruz
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar />
      <div className="flex flex-row w-full items-center justify-center mr-72">
        <div className="flex flex-grow justify-end mr-20">
          <img
            className="flex w-80 h-80 object-cover"
            id="video_feed"
            src={
              isConnected
                ? `${process.env.REACT_APP_FLASK_URL}/video_feed`
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            alt="Video Stream"
          />
        </div>
        <div className="flex flex-col flex-grow justify-start items-start text-start">
          <Typography variant="h5">Hedef: {t(targetWord)}</Typography>
          <br />
          <div id="sentence">{sentence}</div>
          <div id="timer">Kalan Süre: {timeLeft} saniye</div>
          {feedback && <div id="feedback">{feedback}</div>}
          <br />
        </div>
      </div>
      <div className="flex flex-row fixed bottom-8 left-0 right-0 w-full px-40 pl-80">
        <div className="flex w-full">
          <div className="flex flex-grow justify-start">
            {feedback && (
              <Typography variant="h6">
                {feedback}
              </Typography>
            )}
          </div>
          <div className="flex flex-grow justify-end">
            <Button
              className="w-40 h-auto"
              variant="contained"
              onClick={handleButtonClick}
            >
              {isConnected ? "Bitir" : "Başla"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShuwaPage;
