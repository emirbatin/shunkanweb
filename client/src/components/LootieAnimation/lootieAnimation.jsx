import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LottieAnimation = ({ animationData }) => {
  const animationContainer = useRef(null);

  useEffect(() => {
    // Lottie animasyonunu başlat
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        progressiveLoad: true,
        hideOnTransparent: true,
      },
    });

    // Component unmount edildiğinde animasyonu temizle
    return () => anim.destroy();
  }, [animationData]); // animationData değişirse animasyonu yeniden başlat

  return <div ref={animationContainer} />;
};

export default LottieAnimation;
