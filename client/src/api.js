//api.js

//Socket.io
import io from "socket.io-client";

const socket = io(`${process.env.REACT_APP_FLASK_URL}`, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    autoConnect: false,
  });
  
  export const connectSocket = () => {
    socket.connect();
  };
  
  export const disconnectSocket = () => {
    socket.disconnect();
  };
  
  export const onSocketConnect = (callback) => {
    socket.on("connect", callback);
  };
  
  export const onSocketDisconnect = (callback) => {
    socket.on("disconnect", callback);
  };
  
  export const onSentenceUpdate = (callback) => {
    socket.on("sentence_update", callback);
  };
  
  export const offSocketConnect = () => {
    socket.off("connect");
  };
  
  export const offSocketDisconnect = () => {
    socket.off("disconnect");
  };
  
  export const offSentenceUpdate = () => {
    socket.off("sentence_update");
  };
  
  export const getVideoFeedUrl = (isConnected) => {
    return isConnected
      ? `${process.env.REACT_APP_FLASK_URL}/video_feed`
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  };

// API çağrıları
// Kullanıcı, kurs, sorular ve cevaplar gibi verileri almak için API çağrıları
  
export const fetchAllUserDetails = async () => {
    try {
      const res = await fetch('/api/users');
      const userData = await res.json();
      if (!res.ok) throw new Error(userData.message || "An error occurred");
      return userData;
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      throw error;
    }
  };

  export const fetchUserDetails = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const userData = await res.json();
      if (!res.ok) throw new Error(userData.error || "Bir hata oluştu");
      return userData;
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
      throw error;
    }
  };

  export const updateUserDetails = async (userId, formData) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update user");
      return await res.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  export const updateUserSettings = async (userId, userData) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error("Güncelleme başarısız");
      return await res.json();
    } catch (error) {
      console.error("Kullanıcı bilgileri güncellenemedi:", error);
      throw error;
    }
  };
  
  
  export const fetchAllCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (!res.ok) throw new Error(`Server responded with status code ${res.status}`);
      return data;
    } catch (error) {
      console.error("Dersler alınamadı:", error);
      throw error;
    }
  };

  export const fetchCourseDetails = async (courseId) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const courseData = await res.json();
      if (!res.ok) throw new Error(courseData.error || "Kurs bilgileri alınamadı");
      return courseData;
    } catch (error) {
      console.error("Kurs bilgileri alınamadı:", error);
      throw error;
    }
  };

  export const createCourse = async (courseData) => {
    try {
      const formData = new FormData();
      for (const key in courseData) {
        formData.append(key, courseData[key]);
      }
  
      const res = await fetch('/api/courses', {
        method: 'POST',
        body: formData,
      });
  
      if (!res.ok) throw new Error('Course creation failed');
      return await res.json();
    } catch (error) {
      console.error('Course creation failed:', error);
      throw error;
    }
  };
  
  export const fetchAllQuestions = async () => {
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      if (!res.ok) throw new Error(`Server responded with status code ${res.status}`);
      return data;
    } catch (error) {
      console.error("Sorular alınamadı:", error);
      throw error;
    }
  };
  
  
  export const fetchQuestionDetails = async (questionId) => {
    try {
      const res = await fetch(`/api/questions/${questionId}`);
      const questionData = await res.json();
      if (!res.ok) throw new Error(questionData.error || "Soru bilgileri alınamadı");
      return questionData;
    } catch (error) {
      console.error("Soru bilgileri alınamadı:", error);
      throw error;
    }
  };

  export const saveWrongAnswers = async (userId, wrongAnswers) => {
    try {
      const formData = new FormData();
      formData.append("wrongAnswers", JSON.stringify(wrongAnswers));
      
      const res = await fetch(`/api/users/${userId}/addWrongAnswers`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error("Yanlış cevaplar kaydedilemedi");
      return await res.json();
    } catch (error) {
      console.error("Yanlış cevaplar kaydedilemedi:", error);
      throw error;
    }
  };
  
  
  export const addCoursePoints = async (userId, points) => {
    try {
      const formData = new FormData();
      formData.append("points", points);
  
      const res = await fetch(`/api/users/${userId}/addCoursePoints`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error("Puanlar eklenemedi");
      return await res.json();
    } catch (error) {
      console.error("Puanlar eklenemedi:", error);
      throw error;
    }
  };

export const fetchStats = async () => {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch stats');
    return data;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    throw error;
  }
};

export const fetchMonthlyData = async () => {
  try {
    const res = await fetch('/api/stats/monthly-data');
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch monthly data');
    return data;
  } catch (error) {
    console.error('Failed to fetch monthly data:', error);
    throw error;
  }
};

export const banUser = async (id) => {
  try {
    const res = await fetch(`/api/users/${id}/ban`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "An error occurred");

    // Kullanıcı banlandıysa token'ı sil
    if (data.user.banned) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }

    return data;
  } catch (error) {
    console.error("Failed to ban/unban user:", error);
    throw error;
  }
};
