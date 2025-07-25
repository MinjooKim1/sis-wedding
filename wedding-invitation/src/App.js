import React, { useState, useEffect } from "react";
import "./App.css";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import GuestbookForm from "./GuestbookForm";
import { db } from "./firebase"; // make sure this path matches your project
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import AccountModal from "./AccountModal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 기본 스타일
import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';
import 'react-calendar/dist/Calendar.css';
import { useSwipeable } from "react-swipeable";
import FallingPetals from "./components/FallingPetals";


function App() {
  const [lang, setLang] = useState("ko");
  const weddingDate = new Date("2025-11-08T15:00:00+09:00");
  const [now, setNow] = useState(new Date());
  const [showGuestbookModal, setShowGuestbookModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPw, setGuestPw] = useState("");
  const [guestMsg, setGuestMsg] = useState("");

  const [guestbookList, setGuestbookList] = useState([
    // 예시글(샘플)도 이 배열에 포함
  ]);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = React.useRef(null);
  const [mapModal, setMapModal] = useState({ open: false, src: "" });
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("Y");
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const brideAccounts = [
    { bank: "국민은행", number: "000-123-456789", holder: "이석훈" },
    { bank: "국민은행", number: "000-123-456789", holder: "이석훈" },
  ];

  const groomAccounts = [
    { bank: "우리은행", number: "100-243-2266279", holder: "김명진" },
  ];

  useEffect(() => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPlaying(false);
        });
      }
    }
    // 사용자 첫 상호작용 시 play() 재시도
    const tryPlay = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    };
    window.addEventListener("click", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });
    return () => {
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, []);

  const handleSoundToggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const dDay = Math.max(
    0,
    Math.ceil((weddingDate - now) / (1000 * 60 * 60 * 24))
  );

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setPhotoIdx((photoIdx + 1) % samplePhotos.length); // 다음 이미지로 이동
      setIsOpen(true); // 슬라이드 열기
    },
    onSwipedRight: () => {
      setPhotoIdx((photoIdx - 1 + samplePhotos.length) % samplePhotos.length); // 이전 이미지로 이동
      setIsOpen(true); // 슬라이드 열기
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // 마우스로도 감지 가능
  });
  // 카운트다운 계산
  const diff = weddingDate - now;
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const mins = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
  const secs = Math.max(0, Math.floor((diff / 1000) % 60));

  // 달력 데이터 생성
  function getCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    let week = Array(firstDay).fill(null);
    for (let d = 1; d <= lastDate; d++) {
      week.push(d);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length)
      weeks.push([...week, ...Array(7 - week.length).fill(null)]);
    return weeks;
  }
  const calYear = weddingDate.getFullYear();
  const calMonth = weddingDate.getMonth();
  const calWeeks = getCalendar(calYear, calMonth);
  const today = now.getDate();
  const isThisMonth =
    now.getFullYear() === calYear && now.getMonth() === calMonth;

  // main_photos 폴더의 9장 이미지 사용
  const mainPhotoFiles = [
    "WS_00927 ed.png",
    "WS_01847.png",
    "WS_01621.png",
    "WS_00781.png",
    "WS_00597.png",
    "WS_00728.png", //6
    "WS_00344.png",
    "WS_00713.png",
    "WS_01759.png", //9
    "WS_00321.png",
    "WS_01423.png",
    "WS_00049.png",
  ];
  const samplePhotos = mainPhotoFiles.map(
    (f) => process.env.PUBLIC_URL + "/main_photos/" + f
  );
  const [photoIdx, setPhotoIdx] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);
  useEffect(() => {
    const fetchGuestbook = async () => {
      const q = query(
        collection(db, "guestbook"),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().timestamp.toDate().toISOString(),
      }));
      setGuestbookList(messages);
    };
    fetchGuestbook();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;

  // Calculate indexes
  const indexOfLast = currentPage * commentsPerPage;
  const indexOfFirst = indexOfLast - commentsPerPage;
  const currentComments = guestbookList.slice(indexOfFirst, indexOfLast);

  // 다국어 텍스트
  const text = {
    ko: {
      invitationTitle: "소중한 분들을 초대합니다.",
      invitationMsg: `저희 두 사람의 작은 만남이 사랑의 결실을 이루어 소중한 결혼식을 올리게 되었습니다.\n\n평생 서로 귀하게 여기며 첫마음 그대로 존중하고 배려하며 살겠습니다.\n\n오로지 믿음과 사랑을 약속하는 날 오셔서 축복해 주시면 더없는 기쁨으로 간직하겠습니다.\n\n 명진 & 제이미`,
      dday: `제이미, 명진의 결혼식이 ${dDay}일 남았습니다.`,
      date: "2025년 11월 8일 토요일, 오후 3시",
      place: "남산골한옥마을 관훈동 민씨가옥",
      address: "서울 중구 퇴계로 34길 28",
      tel: "02-6358-5543",
      map: "지도보기",
      call: "전화하기",
      banquet: "연회 & 식사 안내, 오후 4시",
      banquetDesc: "솔라고 호텔 2층 연회장",
      banquetDesc2: "(민씨가옥에서 5분 거리).",
      banquetDesc3:
        "부족함 없이 즐기실 수 있도록 한식을 비롯해 중식, 양식, 일식 등 다양한 뷔페 메뉴가 준비되어 있습니다.",
      banquetAddr: "서울 특별시 중구 충무로 2길 9",
      guestbook: "방명록",
      addNote: "스티키노트 추가 →",
      writeNote: "방명록 작성하기",
      viewAll: "전체보기",
      gift: "마음 전하실곳",
      giftDesc:
        "참석이 어려우신 분들을 위해 계좌번호를 기재하였습니다. 너그러운 마음으로 양해 부탁드립니다.",
      account: "김명진 우리은행 1002432266279",
      rsvp: "참석 의사 전달",
      rsvpDesc: "신랑, 신부에게 참석의사를 미리 전달할 수 있어요",
      name: "이름",
      availability: "참석 여부",
      yes: "참석",
      no: "불참",
      submit: "참석의사 전달하기",
    },
    en: {
      invitationTitle: "You are cordially invited.",
      invitationMsg: `We are happy to share that what began as a simple meeting has grown into a beautiful love story. 

We will soon be celebrating our wedding, a day filled with love, commitment, and faith.

As we vow to honour, support, and care for one another as we always have, it would mean the world to us to have you there to witness and share in this special moment. \n\nTaylor & Jamie`,
      dday: `148 days left until Jamie & Taylor's wedding.`,
      date: "Saturday, November 8, 2025, 3:00 PM",
      place: "Namsangol Hanok Village, Gwanhundong Min Family House",
      address: "28, Toegye-ro 34-gil, Jung-gu, Seoul",
      tel: "+82-2-6358-5543",
      map: "View Map",
      call: "Call",
      banquet: "Banquet & Meal Info, 4PM",
      banquetDesc: "at the 2nd floor hall of Sollago Hotel",
      banquetDesc2: "a 5-minute walk away from the Hanok Village.",
      banquetDesc3:
        "A variety of buffet menus including Korean, Chinese, Western, and Japanese cuisine will be served.`,",
      banquetAddr: "9, Chungmuro 2-gil, Jung-gu, Seoul",
      guestbook: "Guestbook",
      addNote: "Add sticky note →",
      writeNote: "Write a note",
      viewAll: "View all",
      gift: "Gift",
      giftDesc:
        "For those unable to attend, we have provided a bank account below. Thank you for your understanding.",
      account: "Taylor (Myungjin) Woori Bank 1002432266279",
      rsvp: "RSVP",
      rsvpDesc: "Let the bride and groom know your attendance in advance",
      name: "Name",
      availability: "Attendance",
      yes: "Yes",
      no: "No",
      submit: "Submit RSVP",
    },
  };

  // 메인 사진 섹션 다국어 텍스트
  const mainSectionText = {
    ko: {
      phrase: "언제나 한결같이, 평생 함께",
      names: "김명진 & 제이미",
    },
    en: {
      phrase: "Always together, forever as one",
      names: "Taylor & Jamie",
    },
  };

  // Guestbook i18n text
  const guestbookText = {
    ko: {
      title: "방명록",
      subtitle: "축하 메시지를 남겨주세요",
      name: "이름",
      password: "비밀번호",
      message: "축하메시지",
      submit: "축하메시지 남기기",
      more: "더보기",
      all: "전체보기",
      noComments: "아직 방명록이 없습니다.",
    },
    en: {
      title: "Guest Book",
      subtitle: "Leave a congratulatory message",
      name: "Name",
      password: "Password",
      message: "Message",
      submit: "Leave a message",
      more: "More",
      all: "View all",
      noComments: "No guestbook entries yet.",
    },
  };

  // D-day labels for bilingual support
  const ddayLabels = {
    ko: {
      weekday: "토요일 낮 3시",
      days: "일",
      hour: "시간",
      min: "분",
      sec: "초",
      countdown: `명진, 제이미의 결혼식이 `,
      left: "일 남았습니다.",
    },
    en: {
      weekday: "Saturday, 3:00 PM",
      days: "DAYS",
      hour: "HOUR",
      min: "MIN",
      sec: "SEC",
      countdown: `Taylor & Jamie's wedding is in `,
      left: "days left.",
    },
  };

  // 랜딩페이지 다국어 텍스트
  const landingText = {
    ko: {
      groom: "신랑",
      bride: "신부",
      groomName: "명진",
      brideName: "제이미",
      date: "2025.11.08 토요일 오후 3시",
      place: "남산골한옥마을 관훈동 민씨가옥",
    },
    en: {
      groom: "GROOM",
      bride: "BRIDE",
      groomName: "Taylor",
      brideName: "Jamie",
      date: "SAT, NOV 8, 2025, 3:00 PM",
      place: "Namsangol Hanok Village, Min Clan’s House",
    },
  };

  return(
 
    <div className="invitation-container">
      {/* 최상단 언어 전환 버튼 영역 */}
      <div
        style={{
          width: "100%",
          height: 100,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 0,
          paddingBottom: 0,
          margin: 0,
        }}
      >
        <div
          className="lang-switch"
          style={{ position: "static", textAlign: "center", margin: 0 }}
        >
          <button onClick={() => setLang("ko")}>한국어</button>
          <button onClick={() => setLang("en")}>English</button>
        </div>
      </div>
      {/* 랜딩페이지 섹션 */}
      <FallingPetals/>
      <section
        className="landing-section"
        style={{ padding: 0, margin: 0, marginBottom: 0 }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            margin: 0,
            borderRadius: 0,
            overflow: "hidden",
            background: "none",
            boxShadow: "none",
            padding: 0,
          }}
        >

          {/* Main background image */}
          <img
            src={process.env.PUBLIC_URL + "/main_photos/main.png"}
            alt="landing-main"
            style={{
              width: "100%",
              height: "70vh",
              objectFit: "cover",
              display: "block",
              margin: 0,
              padding: 0,
              border: "none",
            }}
          />
        </div>
        {/* 이름/장소만 표시 */}
        <div className="landing-section-info" style={{ padding: "0 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
              fontSize: lang === "en" ? 19 : 28,
              fontWeight: 700,
              color: "#222",
              marginBottom: 19,
              fontFamily:
                lang === "ko"
                  ? "Gowun Batang, Noto Serif KR, serif"
                  : "Cormorant Garamond, Playfair Display, serif",
              letterSpacing: "0.08em",
            }}
          >
            <span
              className={lang === "en" ? "en-font-bold" : ""}
              style={{ fontWeight: 700 }}
            >
              {landingText[lang].groomName}
            </span>
            <span
              style={{
                fontSize: 22,
                color: "#f7a6b2",
                fontWeight: 400,
                margin: "0 8px",
              }}
            >
              |
            </span>
            <span
              className={lang === "en" ? "en-font-bold" : ""}
              style={{ fontWeight: 700 }}
            >
              {landingText[lang].brideName}
            </span>
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#888",
              fontFamily:
                lang === "en"
                  ? "Fira Sans, Arial, sans-serif"
                  : "Playfair Display, serif",
              marginBottom: 12,
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            {lang === "en" ? (
              <span className="en-fira">{landingText[lang].place}</span>
            ) : (
              landingText[lang].place
            )}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#888",
              fontFamily:
                lang === "en"
                  ? "Fira Sans, Arial, sans-serif"
                  : "Playfair Display, serif",
              marginBottom: 48,
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            {lang === "en" ? (
              <span className="en-fira">{landingText[lang].date}</span>
            ) : (
              landingText[lang].date
            )}
          </div>
        </div>
      </section>
      {/* 사운드 아이콘 - 좌상단 */}
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
          <FaVolumeUp size={28} color="#f7a6b2" />
        ) : (
          <FaVolumeMute size={28} color="#f7a6b2" />
        )}
      </button>
      <audio
        ref={audioRef}
        src={process.env.PUBLIC_URL + "/sound.mp3"}
        loop
        autoPlay
      />

      {/* 인삿말 */}
      <section
        className="section-box greeting"
        style={{
          padding: "32px 20px 28px 20px",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
      
        <img 
         src={process.env.PUBLIC_URL + "/overlay/flower.png"}
         alt="landing-main"
         style={{
           width: "60px",
           height: "60px",
           objectFit: "cover",
           display: "block",
           margin: "10px auto",
           padding: 0}}
           />
        <div className="section-title-en">INVITATION</div>
        <div className="section-title-ko">소중한 분들을 초대합니다</div>
        <img
          src={process.env.PUBLIC_URL + "/main_photos/210A1898.jpg"}
          alt="landing-main"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            margin: 0,
            padding: 0,
            border: "none",
            borderRadius: "10px",
          }}
        />
        <pre style={{ padding: "10px 20px" }}>{text[lang].invitationMsg}</pre>
      </section>

      {/* D-day 카운트 */}
      <section
        className="section-box"
        style={{
          padding: "40px 20px",
          backgroundColor: "#fafafa",
          textAlign: "center",
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "2.5rem",
            fontWeight: 400,
            letterSpacing: "0.05em",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          WEDDING DAY
        </h2>

        {/* Date info */}
        <div style={{ fontSize: "1.1rem", color: "#555", marginBottom: "4px" }}>
          {calYear}년 {calMonth + 1}월 {weddingDate.getDate()}일{" "}
          {ddayLabels[lang].weekday}
        </div>
        <div
          style={{ fontSize: "0.95rem", color: "#999", marginBottom: "20px" }}
        >
          Saturday, November 7, 2025 | PM 3:00
        </div>

        {/* Optional: Divider line */}
        <hr
          style={{
            width: "60%",
            margin: "0 auto 30px auto",
            borderColor: "#eee",
          }}
        />

        {/* 🎉 캘린더 삽입 */}
        <div
          style={{
            maxWidth: 340,
            margin: "0 auto 24px auto",
            background: "none",
            border: "none",
          }}
        >
          <Calendar
            value={weddingDate}
            locale={lang === "ko" ? "ko-KR" : "en-US"}
            calendarType="iso8601"
            formatShortWeekday={(locale, date) =>
              ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
            }
            formatDay={(locale, date) => date.getDate()} // ✅ 여기서 "7", "8"만 출력되게!
            tileClassName={({ date, view }) => {
              const classes = [];
              if (
                view === "month" &&
                date.getDate() === weddingDate.getDate() &&
                date.getMonth() === weddingDate.getMonth() &&
                date.getFullYear() === weddingDate.getFullYear()
              ) {
                classes.push("highlight");
              }
              if (date.getDay() === 0) classes.push("sunday");
              if (date.getDay() === 6) classes.push("saturday");
              return classes;
            }}
          />
        </div>

        {/* Optional: Divider line */}
        <hr
          style={{
            width: "60%",
            margin: "30px auto 30px auto",
            borderColor: "#eee",
          }}
        />

        {/* Countdown cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          {[
            { label: ddayLabels[lang].days, value: days },
            {
              label: ddayLabels[lang].hour,
              value: String(hours).padStart(2, "0"),
            },
            {
              label: ddayLabels[lang].min,
              value: String(mins).padStart(2, "0"),
            },
            {
              label: ddayLabels[lang].sec,
              value: String(secs).padStart(2, "0"),
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                width: 70,
                padding: "12px 0",
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", color: "#333" }}>
                {item.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#aaa",
                  letterSpacing: "0.05em",
                }}
              >
                {item.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Countdown footer text */}
        <div style={{ marginTop: 10, fontSize: "0.9rem", color: "#666" }}>
          {ddayLabels[lang].countdown}
          <span style={{ color: "#f7a6b2", fontWeight: 600, margin: "0 4px" }}>
            {dDay}
          </span>
          {lang === "ko" ? ddayLabels[lang].left : ` ${ddayLabels[lang].left}`}
        </div>
      </section>




      
      {/* GALLERY 섹션 */}
      <section
  className="gallery-section"
  style={{ margin: "48px 0 32px 0", padding: "0 20px" }}
>
  <div
    style={{
      textAlign: "center",
      fontFamily: "Playfair Display,serif",
      fontSize: "1.5rem",
      letterSpacing: "0.3em",
      marginBottom: 32,
    }}
  >
    GALLERY
  </div>

  {/* 🟩 3x4 이미지 그리드 */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
      maxWidth: "900px",
      margin: "0 auto",
    }}
  >
    {samplePhotos.slice(0, 12).map((url, idx) => (
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

  {/* 🖼️ 선택된 큰 이미지 (그리드 밑) */}
  <div
  {...swipeHandlers} // ✅ 스와이프 감지 연결
  style={{
    marginTop: "40px",
    textAlign: "center",
  }}
>
  <img
    src={samplePhotos[photoIdx]}
    alt="Selected wedding"
    onClick={() => setIsOpen(true)} // 기존 클릭으로 열기 유지
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

  {/* 📸 Lightbox */}
  {isOpen && (
    <>
      <Lightbox
        mainSrc={samplePhotos[photoIdx]}
        nextSrc={samplePhotos[(photoIdx + 1) % samplePhotos.length]}
        prevSrc={
          samplePhotos[
            (photoIdx + samplePhotos.length - 1) % samplePhotos.length
          ]
        }
        onCloseRequest={() => setIsOpen(false)}
        onMovePrevRequest={() =>
          setPhotoIdx(
            (photoIdx + samplePhotos.length - 1) % samplePhotos.length
          )
        }
        onMoveNextRequest={() =>
          setPhotoIdx((photoIdx + 1) % samplePhotos.length)
        }
        imageTitle={`${photoIdx + 1} / ${samplePhotos.length}`}
        reactModalStyle={{ overlay: { zIndex: 9999 } }}
      />

      {/* ❌ Optional close button */}
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
      {/* 날짜/장소/시간/오시는 길 */}
      <section
        className="section-box"
        style={{
          padding: "32px 20px 28px 20px",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <h3>{text[lang].date}</h3>
        <p style={{ fontWeight: "600" }}>{text[lang].place} </p>
        <p
          style={{
            fontSize: "15px",
            whiteSpace: "pre-line",
            marginTop: "10px",
            marginBottom: "0px",
          }}
        >
          {`${text[lang].address}\nTel. ${text[lang].tel}`}
        </p>
        <img
          src={process.env.PUBLIC_URL + "/map_min.png"}
          alt="map"
          style={{
            width: "100%",
            maxWidth: 360,
            margin: "5px auto 0 auto",
            display: "block",
            cursor: "pointer",
          }}
          onClick={() =>
            setMapModal({
              open: true,
              src: process.env.PUBLIC_URL + "/map_min.png",
            })
          }
        />
        <a
          className="circle-button"
          href="https://naver.me/5gFg3FmY"
          target="_blank"
          rel="map"
          style={{
            width: "100px",
            height: "30px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "10px",
          }}
        >
          <span role="img" aria-label="map" style={{ marginRight: "6px" }}>
            📍
          </span>
          {text[lang].map}
        </a>
      </section>

      <div
        style={{ height: "5px", backgroundColor: "#f0f0f0", margin: "16px 0" }}
      />

      {/* 연회 & 식사 안내 */}
      <section
        className="section-box"
        style={{
          padding: "32px 20px 28px 20px",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <h3>{text[lang].banquet}</h3>
        <p style={{ fontWeight: "600", margin: "0px" }}>
          {text[lang].banquetDesc}
        </p>
        <pre style={{ fontSize: "13px" }}>{text[lang].banquetDesc2}</pre>
        <pre>{text[lang].banquetDesc3}</pre>

        <p
          style={{
            fontSize: "15px",
            whiteSpace: "pre-line",
            marginTop: "10px",
            marginBottom: "0px",
          }}
        >
          {text[lang].banquetAddr}
        </p>
        <img
          src={process.env.PUBLIC_URL + "/map_hotel.png"}
          alt="banquet-map"
          style={{
            width: "100%",
            maxWidth: 500,
            margin: "5px auto 0 auto",
            display: "block",
            cursor: "pointer",
          }}
          onClick={() =>
            setMapModal({
              open: true,
              src: process.env.PUBLIC_URL + "/map_hotel.png",
            })
          }
        />
        <a
          className="circle-button"
          href="https://naver.me/x0UPjjrq"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "100px",
            height: "30px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "10px",
          }}
        >
          <span role="img" aria-label="map" style={{ marginRight: "6px" }}>
            📍
          </span>
          {text[lang].map}
        </a>

        <a
          className="circle-button"
          href="tel:0222637979"
          style={{
            width: "100px",
            height: "30px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "10px",
          }}
        >
          <span role="img" aria-label="call" style={{ marginRight: "6px" }}>
            📞
          </span>
          {text[lang].call}
        </a>
      </section>

      {/* 지도 모달 */}
      {mapModal.open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setMapModal({ open: false, src: "" })}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={mapModal.src}
              alt="enlarged-map"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                borderRadius: 8,
                boxShadow: "0 4px 32px #0008",
              }}
            />
            <button
              onClick={() => setMapModal({ open: false, src: "" })}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 마음 전하실 곳 */}
      <section
        className="gift"
        style={{ padding: "32px 20px 28px 20px", textAlign: "center" }}
      >
        <h3>{lang === "ko" ? "마음 전하실 곳" : "GIFT"}</h3>
        <p>
          {lang === "ko"
            ? "참석이 어려우신 분들을 위해 계좌번호를 기재하였습니다.\n너그러운 마음으로 양해 부탁드립니다."
            : "For those unable to attend, we have provided a bank account below. Thank you for your understanding."}
        </p>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setShowModal("bride")}
            style={{
              border: "1px solid rgb(213 213 213)",
              padding: "14px 30px",
              borderRadius: "30px",
              background: "white",
            }}
          >
            {lang === "ko" ? "신부 측 계좌번호" : "Bride's Account Info"}
          </button>

          <button
            onClick={() => setShowModal("groom")}
            style={{
              border: "1px solid rgb(213 213 213)",
              padding: "14px 30px",
              borderRadius: "30px",
              background: "white",
            }}
          >
            {lang === "ko" ? "신랑 측 계좌번호" : "Groom's Account Info"}
          </button>
        </div>

        {showModal && (
          <AccountModal
            title={
              showModal === "bride"
                ? lang === "ko"
                  ? "신부 측 계좌번호"
                  : "Bride's Account Info"
                : lang === "ko"
                ? "신랑 측 계좌번호"
                : "Groom's Account Info"
            }
            accounts={showModal === "bride" ? brideAccounts : groomAccounts}
            onClose={() => setShowModal(null)}
            isKorean={lang === "ko"}
          />
        )}
      </section>

      {/* 참석 의사 전달 */}

      <section
        className="rsvp"
        style={{
          padding: "32px 20px 28px 20px",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <h3>{text[lang].rsvp}</h3>
        <p>{text[lang].rsvpDesc}</p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!rsvpName) {
              alert(
                lang === "ko"
                  ? "이름을 입력해주세요."
                  : "Please enter your name."
              );
              return;
            }

            try {
              await addDoc(collection(db, "rsvps"), {
                name: rsvpName,
                status: rsvpStatus,
                createdAt: Timestamp.now(),
              });
              alert(
                lang === "ko"
                  ? "참석 의사가 저장되었어요!"
                  : "RSVP saved successfully!"
              );
              setRsvpName("");
              setRsvpStatus("Y");
            } catch (error) {
              console.error("RSVP 저장 오류", error);
              alert(
                lang === "ko" ? "저장에 실패했어요." : "Failed to save RSVP."
              );
            }
          }}
        >
          <input
            type="text"
            value={rsvpName}
            onChange={(e) => setRsvpName(e.target.value)}
            placeholder={text[lang].name}
          />
          <select
            value={rsvpStatus}
            onChange={(e) => setRsvpStatus(e.target.value)}
          >
            <option value="Y">{text[lang].yes}</option>
            <option value="N">{text[lang].no}</option>
          </select>
          <button type="submit" className="deliver-btn">
            {text[lang].submit}
          </button>
        </form>
      </section>

      {/* 방명록 */}
      <section
        className="guestbook"
        style={{
          padding: "32px 20px 28px 20px",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <div className="guestbook-title">
          <div
            className="guestbook-en"
            style={{
              fontSize: "1.3rem",
              color: "#b87c9b",
              letterSpacing: "0.12em",
              marginBottom: 4,
            }}
          >
            {guestbookText[lang].title.toUpperCase()}
          </div>
          <div
            className="guestbook-ko"
            style={{ fontSize: "15px", color: "#f7a6b2", marginBottom: 18 }}
          >
            {guestbookText[lang].subtitle}
          </div>
        </div>
        <GuestbookForm
          lang={lang}
          guestbookText={guestbookText}
          onNewMessage={(entry) => setGuestbookList([entry, ...guestbookList])}
        />
        <div className="guestbook-comments">
          {currentComments.length === 0 ? (
            <div className="guestbook-no-comments">
              {lang === "ko"
                ? "아직 축하 메시지가 없어요 🥺"
                : "No messages yet 🥺"}
            </div>
          ) : (
            currentComments.map((comment, idx) => (
              <div key={idx} className="guestbook-comment-card">
                <div className="guestbook-comment-header">
                  <span className="guestbook-comment-name">{comment.name}</span>
                  <span className="guestbook-comment-date">{comment.date}</span>
                </div>
                <div className="guestbook-comment-msg">{comment.msg}</div>
              </div>
            ))
          )}
        </div>

        <div
          className="pagination-buttons"
          style={{ marginTop: "16px", textAlign: "center" }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {lang === "ko" ? "이전" : "Previous"}
          </button>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                indexOfLast < guestbookList.length ? prev + 1 : prev
              )
            }
            disabled={indexOfLast >= guestbookList.length}
          >
            {lang === "ko" ? "다음" : "Next"}
          </button>
        </div>
      </section>
    </div>  )}
  
 





export default App;
