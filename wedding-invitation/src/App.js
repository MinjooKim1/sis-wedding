import React, { useState, useEffect } from 'react';
import './App.css';

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

  // 샘플 사진 배열 (10장으로 확장)
  const samplePhotos = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  ];
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
      banquet: '연회 & 식사 안내',
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
      invitationMsg: `We are delighted to announce that our small encounter has blossomed into love, and we will be holding our precious wedding.\n\nWe promise to cherish, respect, and care for each other as we did from the very beginning.\n\nIt would be our greatest joy if you could join us on this day of love and faith.\n\nJamie, son of Gary & Morak\nTaylor, daughter of Jaeduk Kim & Kyungja Shim`,
      dday: `148 days left until Jamie & Taylor's wedding.`,
      date: 'Saturday, November 8, 2025, 3:00 PM',
      place: 'Namsangol Hanok Village, Gwanhundong Min Family House',
      address: '28, Toegye-ro 34-gil, Jung-gu, Seoul',
      tel: '+82-2-6358-5543',
      map: 'View Map',
      banquet: 'Banquet & Meal Info',
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
      countdown: `제이미, 명진의 결혼식이 `,
      left: '일 남았습니다.',
    },
    en: {
      weekday: 'Saturday, 3:00 PM',
      days: 'DAYS',
      hour: 'HOUR',
      min: 'MIN',
      sec: 'SEC',
      countdown: `Jamie & Taylor's wedding is in `,
      left: 'days left.',
    },
  };

  return (
    <div className="invitation-container">
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
            maxWidth: 400,
            height: 'auto',
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
        <a className="section-btn" href="https://naver.me/5Qw1Qw1Q" target="_blank" rel="noopener noreferrer">{text[lang].map}</a>
      </section>

      {/* 연회 & 식사 안내 */}
      <section className="section-box">
        <h3>{text[lang].banquet}</h3>
        <pre>{text[lang].banquetDesc}</pre>
        <p>{text[lang].banquetAddr}</p>
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
