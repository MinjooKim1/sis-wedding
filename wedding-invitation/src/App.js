import React, { useState, useEffect } from 'react';
import './App.css';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

function App() {
  const [lang, setLang] = useState('ko');
  const weddingDate = new Date('2025-11-08T15:00:00+09:00');
  const [now, setNow] = useState(new Date());
  const [showGuestbookModal, setShowGuestbookModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPw, setGuestPw] = useState('');
  const [guestMsg, setGuestMsg] = useState('');
  const [guestbookList, setGuestbookList] = useState([
    // 예시글(샘플)도 이 배열에 포함
  ]);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = React.useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay might be blocked; set isPlaying to false
          setIsPlaying(false);
        });
      }
    }
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
  const dDay = Math.max(0, Math.ceil((weddingDate - now) / (1000 * 60 * 60 * 24)));
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
    if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)]);
    return weeks;
  }
  const calYear = weddingDate.getFullYear();
  const calMonth = weddingDate.getMonth();
  const calWeeks = getCalendar(calYear, calMonth);
  const today = now.getDate();
  const isThisMonth = now.getFullYear() === calYear && now.getMonth() === calMonth;

  // main_photos 폴더의 9장 이미지 사용
  const mainPhotoFiles = [
    'WS_00534.jpg',
    'WS_01566.jpg',
    'WS_00260.jpg',
    'WS_00534.jpg',
    'WS_00927 ed.jpg',
    'WS_01596.jpg',
    'WS_02057.jpg',
    'WS_01621.jpg',
    'WS_01130.jpg',
  ];
  const samplePhotos = mainPhotoFiles.map(f => process.env.PUBLIC_URL + '/main_photos/' + f);
  const [photoIdx, setPhotoIdx] = useState(0);

  // 다국어 텍스트
  const text = {
    ko: {
      invitationTitle: '소중한 분들을 초대합니다.',
      invitationMsg: `저희 두 사람의 작은 만남이 사랑의 결실을 이루어 소중한 결혼식을 올리게 되었습니다.\n\n평생 서로 귀하게 여기며 첫마음 그대로 존중하고 배려하며 살겠습니다.\n\n오로지 믿음과 사랑을 약속하는 날 오셔서 축복해 주시면 더없는 기쁨으로 간직하겠습니다.\n\n개리, 모락 의 아들 제이미\n김재득, 심경자의 딸 명진`,
      dday: `제이미, 명진의 결혼식이 ${dDay}일 남았습니다.`,
      date: '2025년 11월 8일 토요일, 오후 3시',
      place: '남산골한옥마을 관훈동 민씨가옥',
      address: '서울 중구 퇴계로 34길 28',
      tel: '02-6358-5543',
      map: '지도보기',
      banquet: '연회 & 식사 안내, 오후 4시',
      banquetDesc: `식사는 혼례 및 사진 촬영이 끝난 후 도보로 5분 거리에 있는 솔라고 호텔 2층 연회장 에서 진행됩니다.\n\n부족함 없이 즐기실 수 있도록 한식을 비롯해 중식, 양식, 일식 등 다양한 뷔페 메뉴가 준비되어 있습니다.`,
      banquetAddr: '서울 특별시 중구 충무로 2길 9',
      guestbook: '방명록',
      addNote: '스티키노트 추가 →',
      writeNote: '방명록 작성하기',
      viewAll: '전체보기',
      gift: '마음 전하실곳',
      giftDesc: '참석이 어려우신 분들을 위해 계좌번호를 기재하였습니다. 너그러운 마음으로 양해 부탁드립니다.',
      account: '김명진 우리은행 1002432266279',
      rsvp: '참석 의사 전달',
      rsvpDesc: '신랑, 신부에게 참석의사를 미리 전달할 수 있어요',
      name: '이름',
      availability: '참석 여부',
      yes: '참석',
      no: '불참',
      submit: '참석의사 전달하기',
    },
    en: {
      invitationTitle: 'You are cordially invited.',
      invitationMsg: `We are happy to share that what began as a simple meeting has grown into a beautiful love story. 

We will soon be celebrating our wedding, a day filled with love, commitment, and faith.

As we vow to honour, support, and care for one another as we always have, it would mean the world to us to have you there to witness and share in this special moment. \n\nTaylor & Jamie`,
      dday: `148 days left until Jamie & Taylor's wedding.`,
      date: 'Saturday, November 8, 2025, 3:00 PM',
      place: 'Namsangol Hanok Village, Gwanhundong Min Family House',
      address: '28, Toegye-ro 34-gil, Jung-gu, Seoul',
      tel: '+82-2-6358-5543',
      map: 'View Map',
      banquet: 'Banquet & Meal Info, 4PM',
      banquetDesc: `After the ceremony and photo session, a banquet will be held at the 2nd floor hall of Sollago Hotel, a 5-minute walk away.\n\nA variety of buffet menus including Korean, Chinese, Western, and Japanese cuisine will be served.`,
      banquetAddr: '9, Chungmuro 2-gil, Jung-gu, Seoul',
      guestbook: 'Guestbook',
      addNote: 'Add sticky note →',
      writeNote: 'Write a note',
      viewAll: 'View all',
      gift: 'Gift',
      giftDesc: 'For those unable to attend, we have provided a bank account below. Thank you for your understanding.',
      account: 'Taylor (Myungjin) Woori Bank 1002432266279',
      rsvp: 'RSVP',
      rsvpDesc: 'Let the bride and groom know your attendance in advance',
      name: 'Name',
      availability: 'Attendance',
      yes: 'Yes',
      no: 'No',
      submit: 'Submit RSVP',
    }
  };

  // 메인 사진 섹션 다국어 텍스트
  const mainSectionText = {
    ko: {
      phrase: '언제나 한결같이, 평생 함께',
      names: '김명진 & 제이미',
    },
    en: {
      phrase: 'Always together, forever as one',
      names: 'Taylor & Jamie',
    },
  };

  // Guestbook i18n text
  const guestbookText = {
    ko: {
      title: '방명록',
      subtitle: '축하 메시지를 남겨주세요',
      name: '이름',
      password: '비밀번호',
      message: '축하메시지',
      submit: '축하메시지 남기기',
      more: '더보기',
      all: '전체보기',
      noComments: '아직 방명록이 없습니다.',
    },
    en: {
      title: 'Guest Book',
      subtitle: 'Leave a congratulatory message',
      name: 'Name',
      password: 'Password',
      message: 'Message',
      submit: 'Leave a message',
      more: 'More',
      all: 'View all',
      noComments: 'No guestbook entries yet.',
    },
  };

  // D-day labels for bilingual support
  const ddayLabels = {
    ko: {
      weekday: '토요일 낮 3시',
      days: '일',
      hour: '시간',
      min: '분',
      sec: '초',
      countdown: `명진, 제이미의 결혼식이 `,
      left: '일 남았습니다.',
    },
    en: {
      weekday: 'Saturday, 3:00 PM',
      days: 'DAYS',
      hour: 'HOUR',
      min: 'MIN',
      sec: 'SEC',
      countdown: `Taylor & Jamie's wedding is in `,
      left: 'days left.',
    },
  };

  return (
    <div className="invitation-container">
      {/* 사운드 아이콘 - 좌상단 */}
      <button
        className="sound-toggle-btn"
        style={{position:'absolute', left:16, top:16, background:'none', border:'none', cursor:'pointer', zIndex:10}}
        onClick={handleSoundToggle}
        aria-label={isPlaying ? 'Pause sound' : 'Play sound'}
      >
        {isPlaying ? <FaVolumeUp size={28} color="#f7a6b2" /> : <FaVolumeMute size={28} color="#f7a6b2" />}
      </button>
      <audio ref={audioRef} src={process.env.PUBLIC_URL + '/sound.mp3'} loop autoPlay />
      {/* 언어 전환 버튼 - 최상단으로 이동 */}
      <div className="lang-switch" style={{position: 'relative', textAlign: 'right', marginBottom: 16}}>
        <button onClick={() => setLang('ko')}>한국어</button>
        <button onClick={() => setLang('en')}>English</button>
      </div>

      {/* 메인 사진 및 이름/문구 섹션 */}
      <section className="main-photo-section" style={{textAlign: 'center', marginBottom: 40}}>
        <img 
          src={process.env.PUBLIC_URL + '/main_photos/WS_02233.jpg'} 
          alt="main" 
          style={{
            width: '100%',
            aspectRatio: '3/2',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            margin: '0 auto',
            display: 'block',
          }}
        />
        <div style={{marginTop: 32, color: '#888', fontSize: '1.1rem', letterSpacing: '0.08em'}}>
          {mainSectionText[lang].phrase}
        </div>
        <div style={{marginTop: 12, fontWeight: 600, fontSize: '2rem', color: '#222'}}>
          {mainSectionText[lang].names}
        </div>
      </section>

      {/* 인삿말 */}
      <section className="section-box">
        <div className="section-title-en">INVITATION</div>
        <div className="section-title-ko">소중한 분들을 초대합니다</div>
        <pre>{text[lang].invitationMsg}</pre>
      </section>

      {/* D-day 카운트 */}
      <section className="section-box">
        <div style={{marginBottom: 24}}>
          <div style={{fontSize: '2.5rem', fontWeight: 500, color: '#555', letterSpacing: '0.08em'}}>
            {lang === 'ko'
              ? `${calYear}.${String(calMonth+1).padStart(2,'0')}.${String(weddingDate.getDate()).padStart(2,'0')}`
              : `${calYear}.${String(calMonth+1).padStart(2,'0')}.${String(weddingDate.getDate()).padStart(2,'0')}`}
          </div>
          <div style={{fontSize: '1.2rem', color: '#888', marginTop: 6}}>
            {ddayLabels[lang].weekday}
          </div>
        </div>
        <div style={{maxWidth: 340, margin: '0 auto 24px auto'}}></div>
        <div style={{display:'flex', justifyContent:'center', gap:24, margin:'24px 0 10px 0', fontFamily:'Playfair Display,serif'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'2rem', color:'#555'}}>{days}</div>
            <div style={{fontSize:'0.9rem', color:'#bbb', letterSpacing:'0.1em'}}>{ddayLabels[lang].days}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'2rem', color:'#555'}}>{String(hours).padStart(2,'0')}</div>
            <div style={{fontSize:'0.9rem', color:'#bbb', letterSpacing:'0.1em'}}>{ddayLabels[lang].hour}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'2rem', color:'#555'}}>{String(mins).padStart(2,'0')}</div>
            <div style={{fontSize:'0.9rem', color:'#bbb', letterSpacing:'0.1em'}}>{ddayLabels[lang].min}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'2rem', color:'#555'}}>{String(secs).padStart(2,'0')}</div>
            <div style={{fontSize:'0.9rem', color:'#bbb', letterSpacing:'0.1em'}}>{ddayLabels[lang].sec}</div>
          </div>
        </div>
        <div style={{marginTop: 10, color:'#555', fontSize:'1.1rem'}}>
          {ddayLabels[lang].countdown}
          <span style={{color:'#f7a6b2', fontWeight:600}}>{dDay}</span>
          {lang === 'ko' ? ddayLabels[lang].left : ` ${ddayLabels[lang].left}`}
        </div>
      </section>

      {/* GALLERY 섹션 */}
      <section className="gallery-section" style={{margin: '48px 0 32px 0'}}>
        <div style={{textAlign:'center', fontFamily:'Playfair Display,serif', fontSize:'1.5rem', letterSpacing:'0.3em', marginBottom:32}}>
          GALLERY
        </div>
        <div className="gallery-grid" style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: '16px', maxWidth: 700, margin:'0 auto'}}>
          {samplePhotos.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`gallery-${idx}`}
              style={{width:'100%', aspectRatio:'1/1', objectFit:'cover', borderRadius:12, cursor:'pointer', boxShadow:'0 2px 8px #0001'}}
              onClick={() => setPhotoIdx(idx)}
            />
          ))}
        </div>
      </section>

      {/* 사진 슬라이드 */}
      <section className="photo-slider">
        <img src={samplePhotos[photoIdx]} alt="wedding" style={{height: 440, objectFit: 'cover', width: '100%', maxWidth: '100%'}} />
        <div>
          <button onClick={() => setPhotoIdx((photoIdx - 1 + samplePhotos.length) % samplePhotos.length)}>&lt;</button>
          <span>{photoIdx + 1} / {samplePhotos.length}</span>
          <button onClick={() => setPhotoIdx((photoIdx + 1) % samplePhotos.length)}>&gt;</button>
        </div>
      </section>

      {/* 날짜/장소/시간/오시는 길 */}
      <section className="section-box">
        <h3>{text[lang].date}</h3>
        <p>{text[lang].place}</p>
        <p>{text[lang].address}</p>
        <p>Tel. {text[lang].tel}</p>
        <img
          src={process.env.PUBLIC_URL + '/map_min.png'}
          alt="map"
          style={{width:'100%', maxWidth:500, borderRadius:12, margin:'18px auto 0 auto', display:'block', border:'1px solid #0002', boxShadow:'0 2px 8px #0001', marginBottom:12}}
        />
        <a className="section-btn" href="https://naver.me/5Qw1Qw1Q" target="_blank" rel="noopener noreferrer">{text[lang].map}</a>
      </section>

      {/* 연회 & 식사 안내 */}
      <section className="section-box">
        <h3>{text[lang].banquet}</h3>
        <pre>{text[lang].banquetDesc}</pre>
        <p>{text[lang].banquetAddr}</p>
        <img
          src={process.env.PUBLIC_URL + '/map_hotel.png'}
          alt="banquet-map"
          style={{width:'100%', maxWidth:500, borderRadius:12, margin:'18px auto 0 auto', display:'block', border:'1px solid #0002', boxShadow:'0 2px 8px #0001', marginBottom:12}}
        />
        <a className="section-btn" href="https://naver.me/5Qw1Qw1Q" target="_blank" rel="noopener noreferrer">{text[lang].map}</a>
      </section>

      {/* 방명록 */}
      <section className="guestbook">
        <div className="guestbook-title">
          <div className="guestbook-en" style={{fontSize:'1.3rem', color:'#f7a6b2', letterSpacing:'0.12em', marginBottom:4}}>{guestbookText[lang].title.toUpperCase()}</div>
          <div className="guestbook-ko" style={{fontSize:'1.1rem', color:'#f7a6b2', marginBottom:18}}>{guestbookText[lang].subtitle}</div>
        </div>
        <form className="guestbook-form" style={{display:'flex', flexDirection:'column', gap:12, marginBottom:24}} onSubmit={e => {
          e.preventDefault();
          if (!guestName || !guestPw || !guestMsg) return;
          setGuestbookList([
            {
              name: guestName,
              pw: guestPw,
              msg: guestMsg,
              date: new Date().toISOString(),
            },
            ...guestbookList,
          ]);
          setGuestName('');
          setGuestPw('');
          setGuestMsg('');
        }}>
          <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder={guestbookText[lang].name} className="guestbook-input" />
          <input type="password" value={guestPw} onChange={e => setGuestPw(e.target.value)} placeholder={guestbookText[lang].password} className="guestbook-input" />
          <input value={guestMsg} onChange={e => setGuestMsg(e.target.value)} placeholder={guestbookText[lang].message} className="guestbook-input" />
          <button type="submit" className="guestbook-submit-btn">{guestbookText[lang].submit}</button>
        </form>
        <div className="guestbook-comments">
          {guestbookList.length === 0 ? (
            <div className="guestbook-no-comments">{guestbookText[lang].noComments}</div>
          ) : (
            guestbookList.map((item, idx) => (
              <div className="guestbook-comment-card" key={idx}>
                <div className="guestbook-comment-header">
                  <span className="guestbook-comment-name">{item.name}</span>
                  <span className="guestbook-comment-date">{item.date.slice(0,10)} {item.date.slice(11,16)}</span>
                </div>
                <div className="guestbook-comment-msg">{item.msg}</div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 마음 전하실 곳 */}
      <section className="gift">
        <h3>{text[lang].gift}</h3>
        <p>{text[lang].giftDesc}</p>
        <p>{text[lang].account}</p>
      </section>

      {/* 참석 의사 전달 */}
      <section className="rsvp">
        <h3>{text[lang].rsvp}</h3>
        <p>{text[lang].rsvpDesc}</p>
        <form>
          <input type="text" placeholder={text[lang].name} />
          <select>
            <option value="Y">{text[lang].yes}</option>
            <option value="N">{text[lang].no}</option>
          </select>
          <button type="submit">{text[lang].submit}</button>
        </form>
      </section>
    </div>
  );
}

export default App;
