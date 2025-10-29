import React, { useState, useEffect } from "react";
import "./App.css";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
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
import "react-calendar/dist/Calendar.css"; // 기본 스타일
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";
import "react-calendar/dist/Calendar.css";
import { useSwipeable } from "react-swipeable";
import FallingPetals from "./components/FallingPetals";
import { FiCopy } from "react-icons/fi"; // Feather icon
import { FaSubway, FaBus, FaParking } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import ImageTransition from "./components/ImageTransition"; // 경로 주의!
import BrideGroomInfo from "./components/BrideGroomInfo";
import ContactModal from "./components/ContactModal";
import SoundToggle from "./components/SoundToggle";
import GallerySection from "./components/PhotoGallery";
import WeddingRSVP from "./components/WeddingRSVP";
import IntroOverlay from "./IntroOverlay";
import Handwriting from './components/Handwriting';
import EntranceOverlay from './components/EntranceOverlay';
import BottomMenuBar from './components/BottomMenuBar';

function App() {
  const [lang, setLang] = useState("ko");
  const weddingDate = new Date("2025-11-08T15:00:00+09:00");
  const [now, setNow] = useState(new Date());

  const [guestbookList, setGuestbookList] = useState([
    // 예시글(샘플)도 이 배열에 포함
  ]);
  const [mapModal, setMapModal] = useState({ open: false, src: "" });
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLargeMap, setShowLargeMap] = useState(false);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [showHandwriting, setShowHandwriting] = useState(false);
  
  const brideAccounts = [
    { bank: "신한은행", number: "110-385-015325", holder: "심경자" },
    {
      bank: "E-Transfer",
      number: "taylorkim211@gmail.com",
      holder: "Taylor Kim",
    },
  ];

  // Handle entrance - start music and show handwriting
  const handleEnter = () => {
    console.log("👋 User clicked Enter button!");
    setHasEntered(true);
    setShowHandwriting(true);
    
    // Start music immediately (user interaction allows this!)
    setTimeout(() => {
      console.log("🎵 Starting music after user interaction...");
      setShouldPlayMusic(true);
    }, 100);
    
    // Hide handwriting after animation
    setTimeout(() => {
      setShowHandwriting(false);
    }, 2200);
  };

  // Handle bottom menu actions
  const handleShowVenueMap = () => {
    // Center the date block in the viewport
    const target = document.getElementById('venue-date');
    if (target) {
      const rect = target.getBoundingClientRect();
      const y = rect.top + window.pageYOffset - (window.innerHeight / 2) + (rect.height / 2);
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleShowParking = () => {
    // Center the parking text block in the viewport
    const target = document.getElementById('parking-text');
    if (target) {
      const rect = target.getBoundingClientRect();
      const y = rect.top + window.pageYOffset - (window.innerHeight / 2) + (rect.height / 2);
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800, // 애니메이션 지속시간 (ms)
      once: true, // 한 번만 실행
    });
  }, []);

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
    "main3.png",
    "WS_01847.png",
    "WS_01621.png",
    "WS_00781.png",
    "WS_00597.png",
    "WS_00728.png", //6
    "WS_00713.png",
    "WS_01759.png", //9
    "WS_00321.png",
    "WS_01423.png",
    "WS_00049.png",
    "WS_00927 ed.png",
    "WS_00410.png",
    "WS_00633.png",
    "WS_01296.png",
    "WS_01329.png",
    "WS_01596.png",
    "210A1761.png",
"210A1855.png",
"210A1936.png",
"210A1975.png",
"210A1991.png",
"210A2033.png",
"210A2041.png",
"210A2043.png",
"210A2114.png",
"WS_00122.png",
"WS_00555.png",
"WS_00997.png",
"WS_01494.png",
"WS_01496.png",
"WS_01549.png",
"WS_01676.png",
"WS_01746.png",
"WS_02017.png",
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

  //  오버레이 스타트
  const [showOverlay, setShowOverlay] = useState(true);
  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden'; // 스크롤 막기
    } else {
      document.body.style.overflow = 'auto';   // 스크롤 다시 허용
    }
  
    return () => {
      document.body.style.overflow = 'auto'; // 컴포넌트 언마운트 시 초기화
    };
  }, [showOverlay]);

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.8)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

useEffect(() => {
  const timer = setTimeout(() => setShowOverlay(false), 4000); // 4초 후 사라짐
  return () => clearTimeout(timer);
}, []);

  // 다국어 텍스트
  const text = {
    ko: {
      invitationTitle: "소중한 분들을 초대합니다.",
      invitationMsg: `저희 두 사람의 작은 만남이 사랑의 결실을 이루어 소중한 결혼식을 올리게 되었습니다.\n\n평생 서로 귀하게 여기며 첫마음 그대로 존중하고 배려하며 살겠습니다.\n\n오로지 믿음과 사랑을 약속하는 날 오셔서 축복해 주시면 더없는 기쁨으로 간직하겠습니다.`,
      nameTwo: "명진 & 제이미",
      dday: `제이미, 명진의 결혼식이 ${dDay}일 남았습니다.`,
      date: "2025년 11월 8일 토요일, 오후 3시",
      mealTime: "오후 4시",
      place: "남산골한옥마을 관훈동 민씨가옥",
      address: "서울 중구 퇴계로 34길 28",
      tel: "02-6358-5543",
      map: "지도보기",
      call: "전화하기",
      photoInfo: "사진을 클릭하시면 전체 화면 보기가 가능합니다",
      banquet: "연회 & 식사 안내",
      banquetDesc: "솔라고 호텔 2층 연회장",
      banquetDesc2: "(민씨가옥에서 5분 거리).",
      banquetDesc3:
        "부족함 없이 즐기실 수 있도록 한식을 비롯해 중식, 양식, 일식 등 다양한 뷔페 메뉴가 준비되어 있습니다.",
      banquetAddr: "서울 중구 충무로2길 9",
      guestbook: "방명록",
      addNote: "스티키노트 추가 →",
      writeNote: "방명록 작성하기",
      viewAll: "전체보기",
      gift: "마음 전하실곳",
      giftDesc:
        "참석이 어려우신 분들을 위해 계좌번호를 기재하였습니다. 너그러운 마음으로 양해 부탁드립니다.",
      account: "김명진 우리은행 1002432266279",
      rsvpTitle: "참석 의사",
      rsvpDesc:
        "한 분 한 분을 소중히 모실 수 있도록 참석 의사를 전해주시면 감사하겠습니다.",
      rsvpDesc2: "(2025년 10월 25일 까지)",
      groom: "신랑",
      bride: "신부",
      yes: "참석할게요",
      no: "참석이 어려워요",
      name: "참석자 본인 성함",
      includeKid: "아이도 함께 참석해요",
      kidCount: "아이 인원",
      kidAge: "아이 나이",
      submit: "참석 의사 체크하기",
    },
    en: {
      invitationTitle: "You are cordially invited.",
      invitationMsg: `We are happy to share that what began as a simple meeting has grown into a beautiful love story. 

We will soon be celebrating our wedding, a day filled with love, commitment, and faith.

As we vow to honour, support, and care for one another as we always have, it would mean the world to us to have you there to witness and share in this special moment.`,
      dday: `148 days left until Jamie & Taylor's wedding.`,
      nameTwo: "Jamie & Taylor",
      date: "Saturday, November 8, 2025, 3:00 PM",
      place: "Namsangol Hanok Village",
      address:
        "Address: 84-1, Pildong 2-ga, Jung-gu, Seoul (inside Namsangol Hanok Village)",
      tel: "+82-2-6358-5543",
      map: "View Map",
      call: "Call",
      mealTime: "4 PM",
      photoInfo: "Click the photo to view it in full screen.",
      banquet: "Banquet & Meal Info",
      banquetDesc: "Sollago Hotel, 2nd Floor Hall",
      banquetDesc2: "a 5-minute walk away from the Hanok Village.",
      banquetDesc3:
        "A variety of buffet menus including Korean, Chinese, Western, and Japanese cuisine will be served.",
      banquetAddr: "9, Chungmuro 2-gil, Jung-gu, Seoul",
      guestbook: "Guestbook",
      addNote: "Add sticky note →",
      writeNote: "Write a note",
      viewAll: "View all",
      gift: "Gift",
      giftDesc:
        "For those unable to attend, we have provided a bank account below. Thank you for your understanding.",
      account: "Taylor (Myungjin) Woori Bank 1002432266279",
      rsvpTitle: "RSVP",
      rsvpDesc:
        "Please let us know your RSVP ",
      rsvpDesc2: "by October 25, 2025, ",
      rsvpDesc3: "so we can warmly prepare for your presence.",
      groom: "Groom",
      bride: "Bride",
      yes: "I'll attend",
      no: "Sorry, can't make it",
      name: "Your name",
      includeKid: " I will be bringing a child/children",
      kidCount: "Number of kids",
      kidAge: "Child's age",
      submit: "Submit",
    },
  };

  // 메인 사진 섹션 다국어 텍스트
  const mainSectionText = {
    ko: {
      phrase: "언제나 한결같이, 평생 함께",
      names: "제이미 & 김명진",
    },
    en: {
      phrase: "Always together, forever as one",
      names: "Jamie & Taylor",
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

  const directionText = {
    ko: {
      title: "오시는 길",
      name: "남산골한옥마을 – 관훈동민씨가옥",
      address: "서울 중구 필동2가 84-1 (남산골한옥마을 내)",
      phone: "02-2263-0854",
      subwayTitle: "지하철",
      subway: "3·4호선 충무로역 3번 또는 4번 출구 → 도보 약 5분",
      busTitle: "버스",
      bus: `퇴계로3가 또는 한옥마을 정류장 하차\n• 일반: 104, 105, 140, 421, 463, 507, 604, 7011\n• 순환: 남산순환버스 02, 05, 90S 투어\n• 공항: 6001, 6015, 6021`,
      parkingTitle: "주차:",
      parking: `• 남산골한옥마을 내 공영주차장 이용 가능 (※ 유료 / 공간 협소)\n• 솔라고호텔(피로연장) 지하 3~5층 주차장 이용 가능.\n    (2시간 30분 무료주차 가능합니다.)\n→ 도보 약 5~10분 소요되며, 자차 이용 시 더욱 권장드립니다.`,
      note: "※ 가급적 대중교통 또는 솔라고호텔 주차장 이용을 부탁드립니다.",
    },

    en: {
      title: "Directions",
      name: "Namsangol Hanok Village – Min’s House (Minssi Gaok)",
      address:
        "Address: 84-1, Pildong 2-ga, Jung-gu, Seoul (inside Namsangol Hanok Village)",
      phone: "Phone: +82-2-2263-0854",
      subwayTitle: "Subway",
      subway:
        "Line 3 or 4 → Get off at Chungmuro Station, Exit 3 or 4 → 5-minute walk",
      busTitle: "Bus",
      bus: `Get off at Toegye-ro 3-ga or Hanok Village stop
        
        • Regular: 104, 105, 140, 421, 463, 507, 604, 7011
        • Circulation: Namsan Loop Bus 02, 05, 90S Tour
        • Airport: 6001, 6015, 6021`,

      parkingTitle: "Parking:",
      parking: `• Public parking is available inside Namsangol Hanok Village  
        (Paid parking / Limited spaces)
        
        • Hotel underground parking on floors 3-5 is available.
        • 2 hours and 30 minutes of free parking is available.
        → Approximately 5–10 minutes on foot from the ceremony venue  
        → We recommend using hotel parking if driving.`,

      note: "※ For your convenience, we kindly suggest using public transportation or parking at Sollago Hotel.",
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
      countdown: `제이미, 명진의 결혼식이 `,
      left: "일 남았습니다.",
    },
    en: {
      weekday: "Saturday, 3:00 PM",
      days: "DAYS",
      hour: "HOUR",
      min: "MIN",
      sec: "SEC",
      countdown: `Jamie & Taylor's wedding is in `,
      left: "days left.",
    },
  };

  // 랜딩페이지 다국어 텍스트
  const landingText = {
    ko: {
      groom: "신랑",
      bride: "신부",
      gGroomName: "명진",
      groomName: "Taylor",
      brideName: "제이미",
      date: "2025.11.08 토요일 오후 3시",
      place: "남산골한옥마을 관훈동 민씨가옥",
    },
    en: {
      groom: "GROOM",
      bride: "BRIDE",
      kGroomName: "Myungjin",
      groomName: "Taylor",
      brideName: "Jamie",
      date: "SAT, NOV 8, 2025, 3:00 PM",
      place: "Namsangol Hanok Village, Min Clan’s House",
    },
  };

  return (
<>
{/* Entrance Overlay - shown first */}
{!hasEntered && <EntranceOverlay onEnter={handleEnter} lang={lang} />}

{/* Handwriting Animation - shown after entrance */}
{showHandwriting && <Handwriting open={true} maxWidth={380} autoCloseMs={2100} />}

    <div
      className="invitation-container"
      style={{
        maxWidth: "500px", // ✅ 최대 너비 제한
        position: "relative",
        paddingBottom: "80px", // Space for bottom menu bar
      }}
    >
      {/* 최상단 언어 전환 버튼 영역 */}
      <div
        style={{
          // width: "95%",
          height: 60,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
          padding: "10px 20px",
        }}
      >
        {/* 사운드 아이콘 */}
        <SoundToggle lang={lang} shouldPlayMusic={shouldPlayMusic} />

        {/* Contact modal */}

        <ContactModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          lang={lang}
        />
        {/* 언어 변경 버튼 */}
        <div
          className="lang-switch"
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <button onClick={() => setLang("ko")}>한국어</button>
          <button onClick={() => setLang("en")}>English</button>
        </div>
      </div>

      {/* 랜딩페이지 섹션  시작*/}
      <FallingPetals />
      <section
        className="landing-section"
        // style={{ padding: 30 }}
      >
        {/* 텍스트 정보 먼저 배치  맨 위*/}
        <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
    paddingBottom: 10,
    flexWrap: "wrap", // 줄바꿈 대응
  }}
>
  {/* Bride Name */}
  <span style={{ fontSize: "1.3em", fontWeight: 600 }}>
    {landingText[lang].brideName}
  </span>

  {/* Heart */}
  <span
    style={{
      fontSize: 24,
      color: "#f7a6b2",
      fontWeight: 500,
    }}
  >
    ♡
  </span>

  {/* Groom Name */}
{lang === "en" ? (
  <span
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      lineHeight: 1.2,
    }}
  >
    <span style={{ fontSize: "1.3em", fontWeight: 600 }}>
      {landingText[lang].groomName}
    </span>
    <span style={{ fontSize: "0.8em", opacity: 0.6 }}>
      ({landingText[lang].kGroomName})
    </span>
  </span>
) : (
  <span style={{ fontWeight: 600, fontSize: "1.3em" }}>
    {landingText[lang].gGroomName}
  </span>
)}
</div>

        <hr
          style={{
            width: "80%",
            margin: "0 auto 16px auto",
            borderColor: "#eee",
          }}
        />

        <div
          style={{
            fontSize: lang === "en" ? 16 : 18,
            color: "#888",
            fontFamily:
              lang === "en"
                ? "Fira Sans, Arial, sans-serif"
                : "Fira Sans', Arial, sans-serif",
            margin: "16px auto 4px auto",
            fontWeight: 400,
            letterSpacing: "0.04em",
            textAlign: "center",
          }}
        >
          {lang === "en" ? (
            <span className="en-fira">{landingText[lang].date}</span>
          ) : (
            landingText[lang].date
          )}
        </div>

        {/* 사진 아래 배치 */}
        <img
          src={process.env.PUBLIC_URL + "/main_photos/main.png"}
          alt="landing-main"
          style={{
            width: "100%",
            height: "75h",
            objectFit: "cover",
            objectPosition: "top", // ✅ 위쪽 기준으로 보여지게 함
            display: "block",
            margin: 0,
            padding: 0,
            border: "none",
          }}
        />
      </section>

      {/* 인삿말/ 시작 start */}
      <section
        className="section-box greeting"
        style={{
          padding: "60px 0",
          margin: "0",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/overlay/flower.png"}
          alt="landing-main"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            display: "block",
            margin: "20px auto",
            padding: 0,
          }}
        />
        <div
          className="section-title-en"
          data-aos="fade-up"
          style={{
            textAlign: "center",
            fontFamily: "Playfair Display,serif",
            fontSize: "1.5rem",
            letterSpacing: "0.3em",
            marginBottom: 8,
          }}
        >
          INVITATION
        </div>
        <div
          className="section-title-ko"
          data-aos="fade-up"
          style={{ fontSize: "15px" }}
        >
          {text[lang].invitationTitle}
        </div>
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <ImageTransition />
        </div>
        <pre data-aos="fade-up" style={{ padding: "10px 20px" }}>
          {text[lang].invitationMsg}
        </pre>
        <b data-aos="fade-up">{text[lang].nameTwo}</b>
      </section>

      {/* D-day 카운트 */}
      <section
        className="section-box"
        data-aos="fade-up"
        style={{
          padding: "60px 20px",
          backgroundColor: "#fafafa",
          textAlign: "center",
          margin: "0",
        }}
      >
        {/* Title */}

        <img
          src={process.env.PUBLIC_URL + "/overlay/flower.png"}
          alt="landing-main"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            display: "block",
            margin: "10px auto",
            marginTop: 20,
            padding: 0,
          }}
        />
        <div
          style={{
            textAlign: "center",
            fontFamily: "Playfair Display,serif",
            fontSize: "1.5rem",
            letterSpacing: "0.3em",
            marginBottom: 30,
            color: "#b87c9b",
          }}
        >
          WEDDING DAY
        </div>

        {/* Date info */}
        <div style={{ fontSize: "1.1rem", color: "#555", marginBottom: "4px" }}>
          {weddingDate.getUTCFullYear()}년 {weddingDate.getUTCMonth() + 1}월{" "}
          {weddingDate.getUTCDate()}일 {ddayLabels[lang].weekday}
        </div>
        <div
          style={{ fontSize: "0.95rem", color: "#999", marginBottom: "20px" }}
        >
          Saturday, November 8, 2025 | 3:00 PM
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
          <img
            src={process.env.PUBLIC_URL + "/main_photos/calendar.png"}
            alt="landing-main"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
              margin: 0,
              padding: 0,
              border: "none",
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
            justifyContent: "space-between",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
            width: "100%",
            maxWidth: 320, // ✅ 작게 제한
            marginInline: "auto", // 가운데 정렬
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
                width: "22%", // ✅ 퍼센트 기반
                minWidth: 60,
                padding: "10px 0",
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(1rem, 4vw, 1.4rem)", // ✅ 자동 줄어드는 글씨
                  color: "#333",
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontSize: "clamp(0.6rem, 2.5vw, 0.75rem)",
                  color: "#aaa",
                  letterSpacing: "0.08em",
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
          {lang === "ko" ? (
            ddayLabels[lang].left
          ) : (
            <span style={{ textTransform: "none" }}>
              {ddayLabels[lang].days.toLowerCase()}
            </span>
          )}
        </div>
      </section>

      {/* 부모님 아들 딸 */}

      <BrideGroomInfo setIsModalOpen={setIsModalOpen} lang={lang} />

      <GallerySection
        samplePhotos={samplePhotos}
        lang={lang}
        text={text}
        swipeHandlers={swipeHandlers}
      />

      {/* //  날짜/장소/시간/오시는 길 */}
      <section
        id="venue-location"
        className="section-box"
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
            width: "50px",
            height: "50px",
            objectFit: "cover",
            display: "block",
            marginTop: 30,
            margin: "20px auto",
            padding: 0,
          }}
        />
        <div
          style={{
            textAlign: "center",
            fontFamily: "Playfair Display,serif",
            fontSize: "1.5rem",
            letterSpacing: "0.3em",
            marginBottom: 16,

            color: "#e69ac1",
          }}
          data-aos="fade-up"
        >
          LOCATION
        </div>
        <img
          src="/main_photos/mins_house.png"
          data-aos="fade-up"
          alt="Mins' house"
          style={{
            width: "100%",
            background: "#f1f1f1",
            objectFit: "cover",
            marginBottom: "6px",
            borderRadius: "6px",
          }}
        />

        <div style={{ marginTop: "30px" }} data-aos="fade-up">
          <div
            style={{ textAlign: "center", lineHeight: "1.6" }}
            data-aos="fade-up"
          >
            <p
              style={{
                fontWeight: "600",
                marginBottom: "4px",
                fontSize: "20px",
              }}
              data-aos="fade-up"
            >
              {text[lang].place}
            </p>

            <div id="venue-date" style={{ color: "#888888" }} data-aos="fade-up">
              {text[lang].date}
            </div>
            <br></br>
            <br></br>

            <div id="venue-address">
              <span
                style={{ fontSize: "14px", marginBottom: 0 }}
                data-aos="fade-up"
              >
                {directionText[lang].address}
              </span>
              <button
                data-aos="fade-up"
                style={{
                  marginLeft: "8px",
                  fontSize: "0.9em",
                  padding: "2px 2px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(directionText[lang].address);
                  alert("주소가 복사되었습니다!");
                }}
              >
                <FiCopy style={{ marginRight: 4 }} />
              </button>
            </div>
          </div>
        </div>
        <a
          href="https://map.kakao.com/?map_type=TYPE_MAP&q=%EA%B4%80%ED%9B%88%EB%8F%99+%EB%AF%BC%EC%94%A8+%EA%B0%80%EC%98%A5&hId=8246127&mode=place&urlLevel=3&urlX=499490&urlY=1127716"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            data-aos="fade-up"
            src="/main_photos/vilage_map.png"
            alt="Mins' map"
            style={{
              width: "100%",
              background: "#f1f1f1",
              objectFit: "cover",
              marginBottom: "6px",
              borderRadius: "6px",
            }}
          />
        </a>

        <div
          data-aos="fade-up"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          {/* Google Maps */}
          <a
            href="https://maps.app.goo.gl/LmmCiUggPAGuqnTC9"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: "#000",
            }}
          >
            <img
              src="https://yt3.googleusercontent.com/ytc/AIdro_mZGy0ZLktn9NL_4__5MbK49kpYHU8YPkUgvvdpPxt3O6Q=s900-c-k-c0x00ffffff-no-rj"
              alt="Google Map"
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: "#f1f1f1",
                objectFit: "cover",
                marginBottom: "6px",
                border: "solid 1px #eae9e9",
              }}
            />
            <span style={{ fontSize: 14 }}>
              {lang === "ko" ? "구글맵" : "Google Map"}
            </span>
          </a>

          {/* Naver Map */}
          <a
            href="https://naver.me/5gFg3FmY"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: "#000",
            }}
          >
            <img
              src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/15/79/af/1579afe7-27a1-7c65-4445-55a99fc76031/AppIcon-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/434x0w.webp"
              alt="Naver Map"
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: "#f1f1f1",
                objectFit: "cover",
                marginBottom: "6px",
                border: "solid 1px #eae9e9",
              }}
            />
            <span style={{ fontSize: 14 }}>{lang === "ko" ? "네이버지도" : "Naver Map"}</span>
          </a>

          {/* Kakao Map */}
          <a
            href="https://kko.kakao.com/C1VTVtFsFV"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: "#000",
            }}
          >
            <img
              src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ba/45/6c/ba456ce5-e8cb-daf1-4afc-8ef96f2aeb9f/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/434x0w.webp"
              alt="Kakao Map"
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: "#f1f1f1",
                objectFit: "cover",
                marginBottom: "6px",
              }}
            />
            <span style={{ fontSize: 14 }}>
              {lang === "ko" ? "카카오맵" : "Kakao Map"}
            </span>
          </a>
        </div>
      </section>

      <div
        id="parking-info"
        className="direction-section"
        style={{ padding: "20px", lineHeight: 1.6, background: "#f6f6f6" }}
      >
        {/* 화면에 보이는 이미지 */}
        <img
          data-aos="fade-up"
          src="/main_photos/map_min.png" // public 폴더 안에 위치해야 함
          alt="Google Map"
          onClick={() => setShowLargeMap(true)}
          style={{
            width: "100%",
            background: "#f1f1f1",
            objectFit: "cover",
            marginBottom: "6px",
            border: "1px solid #cfcfcf",
            cursor: "zoom-in",
            borderRadius: "6px",
          }}
        />

        {/* 클릭 시 전체화면으로 확대 */}
        {showLargeMap && (
          <div
            onClick={() => setShowLargeMap(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              cursor: "zoom-out",
            }}
          >
            <img
              src="/main_photos/map_min.png"
              alt="Enlarged Map"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
                border: "2px solid white",
                borderRadius: "8px",
              }}
            />
          </div>
        )}
        <div style={{ padding: "10px" }}>
          {/* Subway */}
          <h4 className="direction_head" data-aos="fade-up">
            <FaSubway
              size={16}
              color="#797979"
              style={{ marginRight: "6px", verticalAlign: "-2px" }}
            />
            {directionText[lang].subwayTitle}
          </h4>
          <div
            id="parking-text"
            className="direction_body"
            data-aos="fade-up"
            style={{
              whiteSpace: "pre-line",
              fontFamily: "inherit",
              fontSize: "15px",
            }}
          >
            {directionText[lang].subway}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "90%",
              height: "1px",
              backgroundColor: "#c1c1c1",
              margin: "12px auto",
            }}
            data-aos="fade-up"
          ></div>

          {/* Bus */}
          <h4 className="direction_head" data-aos="fade-up">
            <FaBus
              size={16}
              color="#797979"
              style={{ marginRight: "6px", verticalAlign: "-2px" }}
            />
            {directionText[lang].busTitle}
          </h4>
          <div
            className="direction_body"
            data-aos="fade-up"
            style={{
              whiteSpace: "pre-line",
              fontFamily: "inherit",
              fontSize: "15px",
            }}
          >
            {directionText[lang].bus}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "90%",
              height: "1px",
              backgroundColor: "#c1c1c1",
              margin: "12px auto",
            }}
            data-aos="fade-up"
          ></div>

          {/* Parking */}
          <h4 className="direction_head" data-aos="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaParking
                size={16}
                color="#797979"
                style={{ marginRight: "6px", verticalAlign: "-2px" }}
              />
              {directionText[lang].parkingTitle}
              <span style={{ marginLeft: "8px", fontSize: "14px", color: "#555", fontWeight: "normal" }}>
                {lang === "ko" ? "솔라고 호텔" : "Sollago Hotel"}
              </span>
            </div>
            <a
              href="https://kko.kakao.com/YsHebygNAP"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                padding: "4px 10px",
                backgroundColor: "#FEE500",
                color: "#3C1E1E",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              <img
                src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ba/45/6c/ba456ce5-e8cb-daf1-4afc-8ef96f2aeb9f/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/434x0w.webp"
                alt="Kakao Map"
                style={{
                  width: 16,
                  height: 16,
                }}
              />
              {lang === "ko" ? "카카오맵 바로가기" : "Kakao Map"}
            </a>
          </h4>
          <div
            className="direction_body"
            data-aos="fade-up"
            style={{
              whiteSpace: "pre-line",
              fontFamily: "inherit",
              fontSize: "15px",
            }}
          >
            {lang === "ko" ? (
              <>
                {"• 남산골한옥마을 내 공영주차장 이용 가능 (※ 유료 / 공간 협소)\n"}
                <span style={{ backgroundColor: "#FFFACD", padding: "2px 4px", borderRadius: "3px" }}>
                  <strong>• 솔라고호텔(피로연장) 지하 3~5층 주차장 이용 가능.</strong>
                  {"\n    (2시간 30분 무료주차 가능합니다.)"}
                </span>
                {"\n"}
                {"→ 도보 약 5~10분 소요되며, 자차 이용 시 더욱 권장드립니다."}
              </>
            ) : (
              <>
                {"• Public parking is available inside Namsangol Hanok Village\n        (Paid parking / Limited spaces)\n        \n        "}
                <span style={{ backgroundColor: "#FFFACD", padding: "2px 4px", borderRadius: "3px" }}>
                  <strong>• Hotel underground parking on floors 3-5 is available.</strong>
                  {"\n        • 2 hours and 30 minutes of free parking is available."}
                </span>
                {"\n        "}
                {"→ Approximately 5–10 minutes on foot from the ceremony venue\n        → We recommend using hotel parking if driving."}
              </>
            )}
          </div>

          {/* Note */}
          <p style={{ marginTop: "12px", fontWeight: 500 }} data-aos="fade-up">
            {directionText[lang].note}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      ></div>

      {/* 연회 & 식사 안내 */}
      <section
        className="section-box"
        style={{
          padding: "40px 20px",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
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
            marginTop: 20,
            padding: 0,
          }}
        />
        <h3 data-aos="fade-up" style={{ marginBottom: "10px" }}>
          {text[lang].banquet}
        </h3>
        <img
          data-aos="fade-up"
          src="/main_photos/table_flower.png"
          alt="Enlarged Map"
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            border: "2px solid white",
            borderRadius: "6px",
          }}
        />

        <div data-aos="fade-up" style={{ margin: "50px auto " }}>
          <p
            data-aos="fade-up"
            style={{ fontWeight: "600", marginBottom: 0, fontSize: "20px" }}
          >
            {text[lang].banquetDesc}
          </p>
          <p data-aos="fade-up" style={{ fontSize: "15px", color: "#555" }}>
            {text[lang].mealTime}
          </p>

          <div
            data-aos="fade-up"
            style={{ fontSize: "16px", color: "#5e5e5e", margin: "30px 10px" }}
          >
            {text[lang].banquetDesc3}
          </div>
        </div>

        <div data-aos="fade-up">
          <span
            style={{ fontSize: "14px", marginBottom: 0 }}
            data-aos="fade-up"
          >
            {text[lang].banquetAddr}
          </span>
          <button
            data-aos="fade-up"
            style={{
              marginLeft: "8px",
              fontSize: "0.9em",
              padding: "2px 2px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
            onClick={() => {
              navigator.clipboard.writeText(text[lang].banquetAddr);
              alert("주소가 복사되었습니다!");
            }}
          >
            <FiCopy style={{ marginRight: 4 }} />
          </button>
        </div>

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          {/* Google Maps */}
          <a
            href="https://maps.app.goo.gl/4vCWhGsigcLQFCne6"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: "#000",
            }}
          >
            <img
              src="https://yt3.googleusercontent.com/ytc/AIdro_mZGy0ZLktn9NL_4__5MbK49kpYHU8YPkUgvvdpPxt3O6Q=s900-c-k-c0x00ffffff-no-rj"
              alt="Google Map"
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: "#f1f1f1",
                objectFit: "cover",
                marginBottom: "6px",
                border: "solid 1px #eae9e9",
              }}
            />
            <span style={{ fontSize: 14 }}>
              {lang === "ko" ? "구글맵" : "Google Map"}
            </span>
          </a>

          {/* Naver Map */}
          <a
            href="https://naver.me/x0UPjjrq"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: "#000",
            }}
          >
            <img
              src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/15/79/af/1579afe7-27a1-7c65-4445-55a99fc76031/AppIcon-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/434x0w.webp"
              alt="Naver Map"
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: "#f1f1f1",
                objectFit: "cover",
                marginBottom: "6px",
                border: "solid 1px #eae9e9",
              }}
            />
            <span style={{ fontSize: 14 }}>
              {lang === "ko" ? "네이버지도" : "Naver Map"}
            </span>
          </a>

          {/* Kakao Map */}
          <a
            href="https://kko.kakao.com/YsHebygNAP"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: "#000",
            }}
          >
            <img
              src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ba/45/6c/ba456ce5-e8cb-daf1-4afc-8ef96f2aeb9f/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/434x0w.webp"
              alt="Kakao Map"
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: "#f1f1f1",
                objectFit: "cover",
                marginBottom: "6px",
              }}
            />
            <span style={{ fontSize: 14 }}>
              {lang === "ko" ? "카카오맵" : "Kakao Map"}
            </span>
          </a>
        </div>
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
        style={{ padding: "60px 20px", textAlign: "center" }}
      >
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
            marginTop: 10,
            padding: 0,
          }}
        />
        <h3 data-aos="fade-up"> {lang === "ko" ? "마음 전하실 곳" : "GIFT"}</h3>
        <p className="body_text_deco" data-aos="fade-up">
          {lang === "ko"
            ? "참석이 어려우신 분들을 위해 계좌번호를 기재하였습니다.\n너그러운 마음으로 양해 부탁드립니다."
            : "For those unable to attend, we have provided a bank account below. Thank you for your understanding."}
        </p>

        <div
          data-aos="fade-up"
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            data-aos="fade-up"
            onClick={() => setShowModal("bride")}
            style={{
              background: "#ffd6e8",
              color: "#914e6d",
              border: "none",
              padding: "14px 30px",
              borderRadius: "8px",
              width: "250px",
              fontSize: "16px"
            }}
          >
            {lang === "ko" ? "계좌번호" : "Account Info"}
          </button>
        </div>

        {showModal && (
          <AccountModal
            title={
              showModal === "bride"
                ? lang === "ko"
                  ? "계좌번호"
                  : "Account Info"
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

      {/* 참석의사 */}

      <WeddingRSVP text={text} lang={lang} />

      {/* 방명록 */}
      <section
        className="guestbook"
        style={{
          padding: "60px 25px 80px 25px",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
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
            marginTop: 20,
            padding: 0,
          }}
        />
        <div className="guestbook-title" data-aos="fade-up">
          <div
            data-aos="fade-up"
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
        <div className="guestbook-comments" data-aos="fade-up">
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
    </div>

    {/* Bottom Menu Bar - only show after entrance */}
    {hasEntered && (
      <BottomMenuBar
        lang={lang}
        onShowVenueMap={handleShowVenueMap}
        onShowParking={handleShowParking}
      />
    )}
    </>
  );
}
export default App;
