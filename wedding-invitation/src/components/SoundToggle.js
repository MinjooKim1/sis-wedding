import { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { FaPlay } from "react-icons/fa";

export default function SoundToggle() {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleSoundToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <button
      className="sound-toggle-btn"
      style={{
        position: "absolute",
        left: 16,
        top: 16,
        background: "none",
        border: "none",
        cursor: "pointer",
        zIndex: 10,
      }}
      onClick={handleSoundToggle}
      aria-label={isPlaying ? "Pause sound" : "Play sound"}
    >
      {isPlaying ? (
        <div
        style={{
          backgroundColor: "#dcdcdc",      // 배경 색
          borderRadius: "50%",          // 완전 동그랗게
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Player
          autoplay
          loop
          src={process.env.PUBLIC_URL + "/animations/sound-on.json"}
          style={{ height: 90, width: 90 }}
        />
      </div>
      ) : (
        <div
          style={{
            backgroundColor: "#dcdcdc",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaPlay size={12} color="#333" />
        </div>
      )}
    </button>
  );
}