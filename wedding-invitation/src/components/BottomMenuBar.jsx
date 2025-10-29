import React from 'react';

export default function BottomMenuBar({ lang, onShowVenueMap, onShowParking }) {
  const menuText = {
    ko: {
      venue: '예식장 위치',
      parking: '주차 안내',
    },
    en: {
      venue: 'Venue Map',
      parking: 'Parking Info',
    },
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: '#fff',
        borderTop: '1px solid #e0e0e0',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '400px',
          gap: '12px',
          padding: '0 20px',
        }}
      >
        {/* Venue Map Button */}
        <button
          onClick={onShowVenueMap}
          style={{
            flex: 1,
            height: '50px',
            padding: '0 20px',
            backgroundColor: 'rgba(204, 129, 167, 0.1)',
            color: 'rgb(145, 78, 109)',
            border: '1px solid rgb(204, 129, 167)',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.05em',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(204, 129, 167, 0.15)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(204, 129, 167, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {menuText[lang].venue}
        </button>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            backgroundColor: '#e0e0e0',
            margin: '4px 0',
          }}
        />

        {/* Parking Info Button */}
        <button
          onClick={onShowParking}
          style={{
            flex: 1,
            height: '50px',
            padding: '0 20px',
            backgroundColor: 'rgba(204, 129, 167, 0.1)',
            color: 'rgb(145, 78, 109)',
            border: '1px solid rgb(204, 129, 167)',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.05em',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(204, 129, 167, 0.15)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(204, 129, 167, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {menuText[lang].parking}
        </button>
      </div>
    </div>
  );
}

