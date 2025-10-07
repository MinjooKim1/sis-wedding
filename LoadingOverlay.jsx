import React, { useEffect, useState } from "react";

const LoadingOverlay = () => {
  const [text, setText] = useState("");
  const fullText = "We are getting married";

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150); // Adjust speed here

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2rem",
        fontFamily: "Playfair Display, serif",
        zIndex: 9999,
      }}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "visible",
          textAlign: "center",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default LoadingOverlay;