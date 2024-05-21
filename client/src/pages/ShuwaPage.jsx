import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Typography } from "@mui/material";

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

const ShuwaPage = () => {
  const targetWord = 'konnichiwa'; // Hedef kelimeyi değişken içinde sakla
  const [sentence, setSentence] = useState('Test');
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(10); // 10 saniyelik süre
  const [correctSignDetected, setCorrectSignDetected] = useState(false);

  useEffect(() => {
    // 10 saniyelik zamanlayıcı başlatma
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime > 0) return prevTime - 1;
        return 0;
      });
    }, 1000);

    // Zamanlayıcı bittiğinde işareti kontrol etme
    const timeout = setTimeout(() => {
      if (!correctSignDetected) {
        setFeedback('Yanlış cevap');
      }
    }, 10000); // 10 saniye

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('sentence_update', (data) => {
      setSentence(data.sentence);
      if (data.sentence === targetWord) {
        setCorrectSignDetected(true);
        setFeedback('Doğru cevap!');
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
      socket.off('connect');
      socket.off('sentence_update');
      socket.off('disconnect');
    };
  }, [correctSignDetected, targetWord]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Hedef: {targetWord}</h1>
      <img className='flex w-80 h-80 object-cover' id="video_feed" src="http://localhost:5000/video_feed" alt="Video Stream" />
      <div id="sentence">{sentence}</div>
      <div id="timer">Kalan Süre: {timeLeft} saniye</div>
      {feedback && <div id="feedback">{feedback}</div>}
    </div>
  );
};

export default ShuwaPage;
