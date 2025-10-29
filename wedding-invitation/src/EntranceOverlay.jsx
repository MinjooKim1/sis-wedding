import React from 'react';

export default function EntranceOverlay({ onEnter, lang }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#fff',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Noto Serif KR', serif",
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '400px',
          padding: '20px',
        }}
      >
        {/* Names */}
        <div
          style={{
            fontSize: '2rem',
            fontWeight: '300',
            marginBottom: '20px',
            color: '#333',
            letterSpacing: '0.1em',
          }}
        >
          {lang === 'ko' ? '제이미 & 명진' : 'Jamie & Taylor'}
        </div>

        {/* Divider */}
        <div
          style={{
            width: '60px',
            height: '1px',
            backgroundColor: '#f7a6b2',
            margin: '30px auto',
          }}
        />

        {/* Date */}
        <div
          style={{
            fontSize: '1rem',
            color: '#888',
            marginBottom: '15px',
            letterSpacing: '0.05em',
          }}
        >
          {lang === 'ko' ? '2025년 11월 8일' : 'November 8, 2025'}
        </div>

        <div
          style={{
            fontSize: '0.9rem',
            color: '#aaa',
            marginBottom: '50px',
          }}
        >
          {lang === 'ko' ? '토요일 오후 3시' : 'Saturday, 3:00 PM'}
        </div>

        {/* Enter Button */}
        <button
          onClick={onEnter}
          style={{
            backgroundColor: '#f7a6b2',
            color: '#fff',
            border: 'none',
            padding: '16px 50px',
            fontSize: '1rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.15em',
            fontWeight: '500',
            boxShadow: '0 4px 15px rgba(247, 166, 178, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e69ac1';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(247, 166, 178, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f7a6b2';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(247, 166, 178, 0.3)';
          }}
        >
          {lang === 'ko' ? '입장하기' : 'ENTER'}
        </button>

        {/* Small hint text */}
        <div
          style={{
            marginTop: '30px',
            fontSize: '0.8rem',
            color: '#bbb',
          }}
        >
          {lang === 'ko'
            ? '버튼을 클릭하시면 음악과 함께 초대장이 열립니다'
            : 'Click to view the invitation with music'}
        </div>
      </div>
    </div>
  );
}



