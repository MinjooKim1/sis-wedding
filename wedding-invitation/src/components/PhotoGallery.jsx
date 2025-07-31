import { useState } from "react";
import Lightbox from 'react-image-lightbox'; // 🧠 라이트박스 기능
import 'react-image-lightbox/style.css';     // 🎨 라이트박스 스타일

export default function GallerySection({ samplePhotos, text, lang, swipeHandlers }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayedPhotos = showAll ? samplePhotos : samplePhotos.slice(0, 12);

  return (
    <section className="gallery-section" data-aos="fade-up" style={{ padding: "40px 20px 0", border:"none"}}>
      <img
        src={process.env.PUBLIC_URL + "/overlay/flower.png"}
        alt="flower-deco"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          display: "block",
          margin: "10px auto 20px",
        }}
      />

      <div
        style={{
          textAlign: "center",
          fontFamily: "Playfair Display, serif",
          fontSize: "1.5rem",
          letterSpacing: "0.3em",
          marginBottom: 30,
          color: "#b87c9b",
        }}
      >
        GALLERY
      </div>

      <div
        style={{
          fontSize: 14,
          textAlign: "center",
          color: "#888",
          fontFamily: lang === "en" ? "Fira Sans, Arial, sans-serif" : "Playfair Display, serif",
          marginBottom: 12,
          fontWeight: 500,
          letterSpacing: "0.04em",
        }}
      >
        <span className={lang === "en" ? "en-fira" : undefined}>
          {text[lang]?.photoInfo}
        </span>
      </div>

      {/* 🖼️ 이미지 그리드 */}
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    maxWidth: "900px",
    margin: "0 auto",
  }}
>
  {displayedPhotos.map((url, idx) => (
    <img
      key={idx}
      src={url}
      alt={`Wedding ${idx + 1}`}
      onClick={() => {
        setPhotoIdx(idx);
        setIsOpen(true);
      }}
      style={{
        width: "100%",
        aspectRatio: "1",
        objectFit: "cover",
        objectPosition: "top",
        cursor: "pointer",
      }}
    />
  ))}
</div>

{/* ➕ 더보기/접기 버튼 */}
{samplePhotos.length > 12 && (
  <div style={{ textAlign: "center", marginTop: "16px" }}>
    <button
      onClick={() => setShowAll((prev) => !prev)}
      style={{
        padding: "8px 16px",
        backgroundColor: "#f7a6b2",
        color: "#fff",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      {showAll ? (lang === "ko" ? "접기" : "Show Less") : (lang === "ko" ? "더보기" : "Show More")}
    </button>
  </div>
)}

      {/* 🌸 선택된 큰 이미지 */}
      <div {...swipeHandlers} style={{ marginTop: "20px", textAlign: "center" }}>
        <img
          src={samplePhotos[photoIdx]}
          alt="Selected wedding"
          onClick={() => setIsOpen(true)}
          style={{
            width: "100%",
            maxWidth: "700px",
            height: "70vh",
            objectFit: "cover",
            objectPosition: "top",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            cursor: "pointer",
          }}
        />
        <div style={{ marginTop: 12, color: "#888" }}>
          {photoIdx + 1} / {samplePhotos.length}
        </div>
      </div>

      {/* 🔍 Lightbox */}
      {isOpen && (
        <>
          <Lightbox
            mainSrc={samplePhotos[photoIdx]}
            nextSrc={samplePhotos[(photoIdx + 1) % samplePhotos.length]}
            prevSrc={samplePhotos[(photoIdx + samplePhotos.length - 1) % samplePhotos.length]}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIdx((photoIdx + samplePhotos.length - 1) % samplePhotos.length)
            }
            onMoveNextRequest={() => setPhotoIdx((photoIdx + 1) % samplePhotos.length)}
            imageTitle={`${photoIdx + 1} / ${samplePhotos.length}`}
            reactModalStyle={{ overlay: { zIndex: 9999 } }}
          />
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 10000,
              background: "white",
              border: "none",
              fontSize: "1.5rem",
              borderRadius: "50%",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </>
      )}
    </section>
  );
}