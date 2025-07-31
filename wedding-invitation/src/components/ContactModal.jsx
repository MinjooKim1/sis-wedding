import React from "react";

// ✅ 연락처 목록을 컴포넌트 밖에 선언
const contacts = [
  {
    name: { ko: "제이미", en: "Jamie" },
    role: { ko: "신랑", en: "Groom" },
    email: "jamiehughes37@hotmail.com",
  },
  {
    name: { ko: "김명진", en: "Taylor" },
    role: { ko: "신부", en: "Bride" },
    phone: "010-8073-4025",
    email: "taylorkim211@gmail.com",
  },
  {
    name: { ko: "김재득" },
    role: { ko: "아버지" },
    phone: "01027252400",
  },
  {
    name: { ko: "심경자" },
    role: { ko: "어머니" },
    phone: "01028062011",
  },
];

const ContactModal = ({ isOpen, closeModal, lang }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>
          {lang === "ko" ? "축하 연락하기" : "Send Congrats"}
        </h2>

        {/* 연락처 리스트 */}
        {contacts
  .filter((person) =>
    lang === "ko" || ["Jamie", "Taylor"].includes(person.name.en)
  )
  .map((person, i) => (
    <div key={i} style={styles.row}>
      <div style={styles.nameAndRole}>
        <span>{person.name[lang]}</span>
        {person.role?.[lang] && (
          <span style={styles.role}>{person.role[lang]}</span>
        )}
      </div>
      <div style={styles.buttonGroup}>
        {/* 한국어 버전: 문자 먼저 */}
        {lang === "ko" && person.phone && (
          <>
            {(person.name.ko === "김명진" ||
              person.name.ko === "김재득" ||
              person.name.ko === "심경자") && (
              <a href={`sms:${person.phone}`} style={styles.smsBtn}>
                문자 보내기
              </a>
            )}
          </>
        )}

        {/* 이메일 버튼 (제이미, 김명진) */}
        {person.email && (
          <a href={`mailto:${person.email}`} style={styles.mailBtn}>
            {lang === "ko" ? "이메일" : "Email"}
          </a>
        )}

        {/* 부모님만 전화 */}
        {lang === "ko" &&
          (person.name.ko === "김재득" || person.name.ko === "심경자") && (
            <a href={`tel:${person.phone}`} style={styles.callBtn}>
              전화하기
            </a>
          )}
      </div>
    </div>
  ))}

        <button onClick={closeModal} style={styles.closeBtn}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default ContactModal;


const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "30px 20px",
    width: "90%",
    maxWidth: "480px",
    position: "relative",
    margin: "0 10px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
  closeBtn: {
    position: "absolute",
    top: 15,
    right: 20,
    fontSize: 20,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  title: {
    fontSize: "22px",
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  row: {
    marginBottom: "20px",
  },
  nameAndRole: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "16px",
  },
  role: {
    color: "#888",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  smsBtn: {
    flex: 1,
    backgroundColor: "#ffd6e8",
    color: "#914e6d",
    textAlign: "center",
    padding: "10px",
    borderRadius: "10px",
    textDecoration: "none",
  },
  mailBtn:{
    flex: 1,
    backgroundColor: "#fff4f9",
    color: "rgb(68 68 68)",
    textAlign: "center",
    padding: "10px",
    borderRadius: "10px",
    textDecoration: "none",
    border: "solid 1px #ead0dd"
  },
  callBtn: {
    flex: 1,
    backgroundColor: "#444",
    color: "#fff",
    textAlign: "center",
    padding: "10px",
    borderRadius: "10px",
    textDecoration: "none",
  },
};