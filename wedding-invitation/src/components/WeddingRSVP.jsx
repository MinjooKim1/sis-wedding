import React, { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import RSVPModal from "./RSVPModal";

const WeddingRSVP = ({ text, lang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [rsvpSide, setRsvpSide] = useState(""); // 신랑 or 신부
  const [bringKid, setBringKid] = useState(false);
  const [kidCount, setKidCount] = useState("");
  const [kidAge, setKidAge] = useState("");
  const [specialNote, setSpecialNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!rsvpName) {
      alert(lang === "ko" ? "이름을 입력해주세요." : "Please enter your name.");
      return;
    }
  
    try {
  await addDoc(collection(db, "rsvps"), {
    name: rsvpName,
    status: rsvpStatus,
    side: rsvpSide,
    withKids: bringKid,
    kidsCount: kidCount,
    kidsAge: kidAge,
    note: specialNote,
    createdAt: Timestamp.now(),
  });

  // 상태 초기화
  setRsvpName("");
  setRsvpStatus("Y");
  setRsvpSide("");
  setBringKid(false);
  setKidCount("");
  setKidAge("");
  setSpecialNote("");

  setIsModalOpen(false); // ✅ 먼저 닫고
  setTimeout(() => {
    alert(lang === "ko" ? "참석 의사가 저장되었어요!" : "RSVP saved!");
  }, 100); // ✅ 모달이 닫힌 후 알림
} catch (error) {
  console.error("RSVP 저장 오류", error);
  alert(lang === "ko" ? "저장에 실패했어요." : "Failed to save RSVP.");
}
  };

  return (
    <section className="rsvp" style={{ padding: "60px 20px 80px" }}>
      <img
        data-aos="fade-up"
        src={process.env.PUBLIC_URL + "/overlay/flower.png"}
        alt="landing-main"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          display: "block",
          margin: "10px auto",
        }}
      />
      <h3 data-aos="fade-up">{text[lang].rsvp}</h3>
      <p data-aos="fade-up">{text[lang].rsvpDesc}</p>

      <button
        className="deliver-btn"
        onClick={() => setIsModalOpen(true)}
        style={{
          marginTop: "24px",
          backgroundColor: "#ffd6e8",
          color: "#b87c9b",
          border: "none",
          padding: "12px 24px",
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        참석 의사 체크하기
      </button>

      {isModalOpen && (
        <RSVPModal
        rsvpName={rsvpName}
        setRsvpName={setRsvpName}
        rsvpStatus={rsvpStatus}
        setRsvpStatus={setRsvpStatus}
        rsvpSide={rsvpSide}
        setRsvpSide={setRsvpSide}
        bringKid={bringKid}
        setBringKid={setBringKid}
        kidCount={kidCount}
        setKidCount={setKidCount}
        kidAge={kidAge}
        setKidAge={setKidAge}
        specialNote={specialNote}              // ✅ 추가!
        setSpecialNote={setSpecialNote}        // ✅ 추가!
        handleSubmit={handleSubmit}
        closeModal={() => setIsModalOpen(false)}
        text={text}
        lang={lang}
      />
      )}
    </section>
  );
};

export default WeddingRSVP;