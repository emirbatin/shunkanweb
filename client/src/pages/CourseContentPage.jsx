  import React, { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

  const FirstCoursePage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { courseId } = useParams(); // Get courseId from the URL
    const navigate = useNavigate(); // Initialize useNavigate hook for navigation
    const [course, setCourse] = useState(null);

    // Function to determine the button name based on the activeIndex
    const getButtonName = () => {
      return activeIndex < tabContents.length - 1 ? "Next" : "Finish";
    };

    const tabContents = [
      "İçerik 1",
      "İçerik 2",
    ];

    // Function to render content based on the activeIndex
    const renderContent = (index) => {
      switch (index) {
        case 0:
          return (
            <div className="learn-with-video-content">
              <div className="video-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/IRlUPHpAzmQ?si=00d3IsWme7LL3f93"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="content-container">
                <h2>İlk hecemiz 'あ'</h2>
              </div>
            </div>
          );
        case 1:
          return <div style={{ color: "green", fontSize: "20px" }}>İçerik 2</div>;
        default:
          return <div>Belirtilen içerik bulunamadı.</div>;
      }
    };

    const handlePrev = () => {
      setActiveIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const handleNext = () => {
      if (activeIndex < tabContents.length - 1) {
        setActiveIndex(activeIndex + 1);
      } else {
        navigate("/courses");
      }
    };

    useEffect(() => {
      fetch(`/api/courses/${courseId}`)
        .then((response) => response.json())
        .then((data) => setCourse(data))
        .catch((error) => console.error("Error fetching course details:", error));
    }, [courseId]);

    if (!course) return <div>Loading...</div>;

    return (
      <div>
        <div style={{ marginTop: "20px" }}>{renderContent(activeIndex)}</div>
        <div>
          <button onClick={handleNext} style={{ marginLeft: "10px" }}>
            {getButtonName()}
          </button>
        </div>
      </div>
    );
  };

  export default FirstCoursePage;
