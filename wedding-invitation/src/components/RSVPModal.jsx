import React, { useState } from "react";

const RSVPModal = ({
    rsvpName,
    setRsvpName,
    rsvpStatus,
    setRsvpStatus,
    rsvpSide,
    setRsvpSide,
    bringKid,
    setBringKid,
    kidCount,
    setKidCount,
    kidAge,
    setKidAge,
    specialNote,             // ✅ 추가
    setSpecialNote,          // ✅ 추가
    handleSubmit,
    closeModal,
    lang,
    text,
  }) => {
  if (!rsvpStatus) setRsvpStatus("Y");
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={closeModal}>✕</button>
        <h3 style={styles.title}>{text[lang].rsvpTitle}</h3>
        <p style={styles.description}>{text[lang].rsvpDesc} <strong>{text[lang].rsvpDesc2}</strong>{text[lang].rsvpDesc3}</p>


        {/* 참석 여부 */}
        <div style={styles.toggleGroup}>
          <button
            onClick={() => setRsvpStatus("Y")}
            style={{
              ...styles.toggleButton,
              backgroundColor: rsvpStatus === "Y" ? "#ffd6e8" : "#fff",
              color: rsvpStatus === "Y" ? "#b87c9b" : "#333",
              fontFamily: "Arial, sans-serif;"
            }}
          >
            {text[lang].yes}
          </button>
          <button
            onClick={() => setRsvpStatus("N")}
            style={{
              ...styles.toggleButton,
              backgroundColor: rsvpStatus === "N" ? "#ffd6e8" : "#fff",
              color: rsvpStatus === "N" ? "#b87c9b" : "#333",
            }}
          >
            {text[lang].no}
          </button>
        </div>

        {/* 이름 */}
        <input
  type="text"
  value={rsvpName}
  onChange={(e) => setRsvpName(e.target.value)}
  placeholder={text[lang].name}
  className="rsvp-input"
/>

        {/* 아이 동반 체크 */}
        <label
  style={{
    ...styles.checkboxLabel,
    textAlign: "left", // ✅ 왼쪽 정렬
    display: "block",  // 🔸 필요 시 줄 정렬 보장
  }}
>
  <input
    type="checkbox"
    checked={bringKid}
    onChange={(e) => setBringKid(e.target.checked)}
  />
  {text[lang].includeKid}
</label>
        {/* 아이 수와 나이 드롭다운 */}
        {bringKid && (
          <>
            <input
              type="number"
              value={kidCount}
              min={1}
              max={10}
              onChange={(e) => setKidCount(e.target.value)}
              placeholder={text[lang].kidCount}
              style={styles.input}
              className="rsvp-input"
            />
            <select
              value={kidAge}
              onChange={(e) => setKidAge(e.target.value)}
              style={styles.select}
            >
              <option value="">{text[lang].kidAge}</option>
              <option value="0-2">0–2</option>
              <option value="3-5">3–5</option>
              <option value="6-9">6–9</option>
              <option value="10+">10+</option>
            </select>
          </>
        )}

        <textarea
  value={specialNote}
  className="rsvp-input"
  onChange={(e) => setSpecialNote(e.target.value)}
  placeholder={lang === "ko" ? "메모를 자유롭게 남겨주세요" : "Leave a special note"}
  style={{
    width: "100%",
    height: "100px",
    padding: "10px",
    border: "1.5px solid #f0f0f0",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "Noto Serif KR, serif",
    marginTop: "12px",
  }}
></textarea>

<button onClick={handleSubmit} style={styles.submitBtn}>
          {text[lang].submit}
        </button>
      </div>
    </div>
  );
};

export default RSVPModal;

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, display: "flex",
    justifyContent: "center", alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff", padding: "20px", borderRadius: "12px",
    width: "90%", maxWidth: "400px", position: "relative", margin: "0 10px"
  },
  closeBtn: {
    position: "absolute", top: "16px", right: "16px", border: "none",
    background: "none", fontSize: "20px", cursor: "pointer",
  },
  title: { textAlign: "center", marginBottom: "12px", fontSize: "20px" },
  description: { textAlign: "center", fontSize: "14px", color: "#666", marginBottom: "20px" },
  input: {
    width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "6px",
  },
  select: {
    width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc",
  },
  toggleGroup: {
    display: "flex", gap: "10px", marginBottom: "12px",
  },
  toggleButton: {
    flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ffd6e8 ", cursor: "pointer",
  },
  checkboxLabel: {
    display: "flex", marginBottom: "12px", fontSize: "14px",justifyContent: "flex-start",
  },
  submitBtn: {
    width: "100%", backgroundColor: "#ffd6e8 ", color: "#b87c9b",
    padding: "12px", border: "none", borderRadius: "6px", cursor: "pointer",
    fontSize: "16px",
  },
};