import { useState, useRef, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { FaPlay } from "react-icons/fa";

export default function SoundToggle({ lang = "ko", shouldPlayMusic = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const audioRef = useRef(null);
  const [attempted, setAttempted] = useState(false);

  // Show toast message
  useEffect(() => {
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [lang]);

  // Auto-play music after user clicks Enter (has user interaction)
  useEffect(() => {
    if (shouldPlayMusic && audioRef.current && !attempted) {
      setAttempted(true);
      console.log("🎵 Attempting to play music after user interaction...");
      const audio = audioRef.current;
      
      audio.muted = false;
      audio.volume = 0.7;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("✅ Music started playing successfully!");
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("❌ Music play failed:", error.message);
            setIsPlaying(false);
          });
      }
    }
  }, [shouldPlayMusic, attempted]);

  const handleSoundToggle = () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.muted = false;
      audio.volume = 0.7;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.log("Play error:", error));
    }
  };

  const toastMessage =
    lang === "ko" ? "배경음악이 준비되었습니다." : "Background music is ready.";

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src={process.env.PUBLIC_URL + "/sound.mp3"}
      />

      {showToast && (
        <div
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#333",
          color: "#fff",
          padding: "6px 16px",
          borderRadius: "20px",
          fontSize: "14px",
          zIndex: 9999,
          opacity: 0.95,
          transition: "opacity 1s ease",
      
          // 💡 추가된 부분
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "90vw", // 혹시 너무 길어지면 반응형 제한
        }}
      >
        {toastMessage}
      </div>
      )}

      <button
        className="sound-toggle-btn"
        style={{
          position: "fixed",
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
          {isPlaying ? (
            <Player
              autoplay
              loop
              src={process.env.PUBLIC_URL + "/animations/sound-on.json"}
              style={{ height: 90, width: 90 }}
            />
          ) : (
            <FaPlay size={12} color="#333" />
          )}
        </div>
      </button>
    </>
  );
}