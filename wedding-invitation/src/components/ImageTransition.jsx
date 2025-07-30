import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ImageTransition = () => {
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const timer = setInterval(() => {
      setShowFirst((prev) => !prev);
    }, 3000); // 3초마다 전환

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      data-aos="fade-up"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        height: "400px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* 이미지 A */}
      <img
        src="/main_photos/photo1.jpg"
        alt="First"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: showFirst ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      />

      {/* 이미지 B */}
      <img
        src="/main_photos/photo2.png"
        alt="Second"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: showFirst ? 0 : 1,
          transition: "opacity 1s ease-in-out",
        }}
      />
    </div>
  );
};

export default ImageTransition;