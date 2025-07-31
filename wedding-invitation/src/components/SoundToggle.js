import { useState, useRef, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { FaPlay } from "react-icons/fa";

export default function SoundToggle({ lang = "ko" }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showToast, setShowToast] = useState(true);
  const audioRef = useRef(null);

  // ⏱️ 토스트 자동 사라짐 & 오디오 자동 재생 시도
  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 3000);

    if (audioRef.current) {
      // 오토플레이 시도 (muted)
      audioRef.current.play().catch((e) => {
        console.warn("Autoplay blocked until user interaction.");
      });
    }

    return () => clearTimeout(timer);
  }, []);

  // 🔊 토글 시 음소거 해제/적용
  const handleSoundToggle = () => {
    if (audioRef.current) {
      const shouldPlay = !isPlaying;
      audioRef.current.muted = !shouldPlay;
      if (shouldPlay) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPlaying(shouldPlay);
    }
  };

  const toastMessage =
    lang === "ko" ? "배경음악이 준비되었습니다." : "Background music is ready.";

  return (
    <>
      {/* 🔈 배경음악 */}
      <audio
        ref={audioRef}
        loop
        muted
        autoPlay
        src={process.env.PUBLIC_URL + "/sound.mp3"}
      />

      {/* 📢 토스트 알림 */}
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
            transition: "opacity 0.3s ease",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* 🎵 사운드 토글 버튼 */}
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