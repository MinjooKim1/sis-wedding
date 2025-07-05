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

  // 샘플 사진 배열 (추후 교체)
  const samplePhotos = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
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

  return (
    <div className="invitation-container">
      {/* 언어 전환 버튼 */}
      <div className="lang-switch">
        <button onClick={() => setLang('ko')}>한국어</button>
        <button onClick={() => setLang('en')}>English</button>
      </div>

      {/* 인삿말 */}
      <section className="section-box">
        <div className="section-title-en">INVITATION</div>
        <div className="section-title-ko">소중한 분들을 초대합니다</div>
        <pre>{text[lang].invitationMsg}</pre>
      </section>

      {/* D-day 카운트 */}
      <section className="section-box">
        <div style={{marginBottom: 24}}>
          <div style={{fontSize: '2rem', fontWeight: 500, color: '#555', letterSpacing: '0.08em'}}>
            {calYear}.{String(calMonth+1).padStart(2,'0')}.{String(weddingDate.getDate()).padStart(2,'0')}
          </div>
          <div style={{fontSize: '1.2rem', color: '#888', marginTop: 6}}>
            토요일 낮 3시
          </div>
        </div>
        <div style={{maxWidth: 340, margin: '0 auto 24px auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', fontFamily: 'inherit'}}>
            <thead>
              <tr style={{color: '#f7a6b2', fontWeight: 500, fontSize: '1.1rem'}}>
                {/* {['일','월','화','수','목','금','토'].map((d,i)=>(<th key={i} style={{padding: 4, fontWeight: 400}}>{d}</th>))} */}
              </tr>
            </thead>
            <tbody>
              {calWeeks.map((week, i) => (
                <tr key={i}>
                  {/* {week.map((d, j) => {
                    let style = {padding: 4, borderRadius: '50%', width: 32, height: 32, textAlign: 'center'};
                    if (d === weddingDate.getDate()) style.background = '#f7a6b2', style.color = '#fff';
                    else if (isThisMonth && d === today) style.background = '#e3bfcf', style.color = '#fff';
                    else if (j === 0) style.color = '#f7a6b2';
                    else if (j === 6) style.color = '#7a8bb7';
                    else style.color = '#888';
                    return <td key={j} style={style}>{d||''}</td>;
                  })} */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:24, margin:'24px 0 10px 0', fontFamily:'Playfair Display,serif'}}>
          <div style={{textAlign:'center'}}><div style={{fontSize:'2rem', color:'#555'}}>{days}</div><div style={{fontSize:'0.9rem', color:'#bbb', letterSpacing:'0.1em'}}>DAYS</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:'2rem', color:'#555'}}>{String(hours).padStart(2,'0')}</div><div style={{fontSize:'0.9rem', color:'#bbb', letterSpacing:'0.1em'}}>HOUR</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:'2rem', color:'#555'}}>{String(mins).padStart(2,'0')}</div><div style={{fontSize:'0.9rem', color:'#bbb', letterSpacing:'0.1em'}}>MIN</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:'2rem', color:'#555'}}>{String(secs).padStart(2,'0')}</div><div style={{fontSize:'0.9rem', color:'#bbb', letterSpacing:'0.1em'}}>SEC</div></div>
        </div>
        <div style={{marginTop: 10, color:'#555', fontSize:'1.1rem'}}>
          제이미, 명진의 결혼식이 <span style={{color:'#f7a6b2', fontWeight:600}}>{dDay}</span>일 남았습니다.
        </div>
      </section>

      {/* 사진 슬라이드 */}
      <section className="photo-slider">
        <img src={samplePhotos[photoIdx]} alt="wedding" />
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
          <div className="guestbook-en">GUESTBOOK</div>
          <div className="guestbook-ko">방명록</div>
        </div>
        <div className="guestbook-cards">
          {guestbookList.map((item, idx) => (
            <div className="guestbook-card" key={idx}>
              <div className="guestbook-flower">🌸</div>
              <div className="guestbook-content">{item.msg}</div>
              <div style={{marginTop: 12, fontWeight: 500, color: '#888'}}>- {item.name} -</div>
            </div>
          ))}
          <div className="guestbook-card guestbook-write-card" onClick={() => setShowGuestbookModal(true)} style={{cursor:'pointer'}}>
            <div className="guestbook-write-icon">✏️</div>
            <div className="guestbook-write-text">방명록 작성하기</div>
          </div>
        </div>
        <div className="guestbook-actions">
          <button className="guestbook-action-btn" onClick={() => setShowGuestbookModal(true)}>작성하기</button>
          <button className="guestbook-action-btn">전체보기</button>
        </div>
        {/* 방명록 작성 모달 */}
        {showGuestbookModal && (
          <div className="modal-backdrop" onClick={() => setShowGuestbookModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowGuestbookModal(false)}>×</button>
              <h2 style={{marginTop: 0, fontWeight: 700, fontSize: '1.3rem'}}>방명록 (축하 글) 작성</h2>
              <div className="modal-form-row">
                <label>이름 <span style={{color:'#ff5a5a'}}>*</span></label>
                <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="이름을 입력해 주세요." />
              </div>
              <div className="modal-form-row">
                <label>비밀번호 <span style={{color:'#ff5a5a'}}>*</span></label>
                <input type="password" value={guestPw} onChange={e => setGuestPw(e.target.value)} placeholder="비밀번호를 입력해 주세요." />
              </div>
              <div className="modal-form-row">
                <label>내용 <span style={{color:'#ff5a5a'}}>*</span></label>
                <textarea value={guestMsg} onChange={e => setGuestMsg(e.target.value)} placeholder="내용을 입력해 주세요. (최대 500자)" maxLength={500} rows={5} />
              </div>
              <button className="modal-submit" onClick={() => {alert('축하 글이 임시로 저장됩니다!'); setShowGuestbookModal(false); setGuestName(''); setGuestPw(''); setGuestMsg(''); setGuestbookList([
                ...guestbookList,
                {
                  name: guestName,
                  pw: guestPw,
                  msg: guestMsg,
                  date: new Date().toISOString(),
                }
              ]);}}>신랑 & 신부에게 축하 글 전달하기</button>
            </div>
          </div>
        )}
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
