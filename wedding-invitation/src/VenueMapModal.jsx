import React from 'react';
import { FiCopy, FiX } from 'react-icons/fi';

export default function VenueMapModal({ isOpen, onClose, lang, text, directionText }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10001,
          }}
        >
          <FiX size={20} />
        </button>

        {/* Banner Image */}
        <img
          src="/main_photos/mins_house.png"
          alt="Venue"
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block',
            borderRadius: '12px 12px 0 0',
          }}
        />

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Title */}
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '8px',
              textAlign: 'center',
              color: '#333',
            }}
          >
            {text[lang].place}
          </h2>

          {/* Date and Time */}
          <div
            style={{
              fontSize: '14px',
              color: '#888',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            {text[lang].date}
          </div>

          {/* Address with Copy Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '14px', color: '#555' }}>
              {directionText[lang].address}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(directionText[lang].address);
                alert(lang === 'ko' ? '주소가 복사되었습니다!' : 'Address copied!');
              }}
              style={{
                fontSize: '0.9em',
                padding: '4px 6px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                cursor: 'pointer',
                backgroundColor: '#fff',
              }}
            >
              <FiCopy size={14} />
            </button>
          </div>

          {/* Map Image */}
          <a
            href="https://map.kakao.com/?map_type=TYPE_MAP&q=%EA%B4%80%ED%9B%88%EB%8F%99+%EB%AF%BC%EC%94%A8+%EA%B0%80%EC%98%A5&hId=8246127&mode=place&urlLevel=3&urlX=499490&urlY=1127716"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', marginBottom: '20px' }}
          >
            <img
              src="/main_photos/vilage_map.png"
              alt="Venue Map"
              style={{
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
              }}
            />
          </a>

          {/* Map Service Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #e0e0e0',
            }}
          >
            {/* Google Maps */}
            <a
              href="https://maps.app.goo.gl/LmmCiUggPAGuqnTC9"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#000',
              }}
            >
              <img
                src="https://yt3.googleusercontent.com/ytc/AIdro_mZGy0ZLktn9NL_4__5MbK49kpYHU8YPkUgvvdpPxt3O6Q=s900-c-k-c0x00ffffff-no-rj"
                alt="Google Map"
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: '50%',
                  background: '#f1f1f1',
                  objectFit: 'cover',
                  marginBottom: '6px',
                  border: 'solid 1px #eae9e9',
                }}
              />
              <span style={{ fontSize: 14 }}>
                {lang === 'ko' ? '구글맵' : 'Google Map'}
              </span>
            </a>

            {/* Naver Map */}
            <a
              href="https://naver.me/5gFg3FmY"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#000',
              }}
            >
              <img
                src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/15/79/af/1579afe7-27a1-7c65-4445-55a99fc76031/AppIcon-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/434x0w.webp"
                alt="Naver Map"
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: '50%',
                  background: '#f1f1f1',
                  objectFit: 'cover',
                  marginBottom: '6px',
                  border: 'solid 1px #eae9e9',
                }}
              />
              <span style={{ fontSize: 14 }}>
                {lang === 'ko' ? '네이버지도' : 'Naver Map'}
              </span>
            </a>

            {/* Kakao Map */}
            <a
              href="https://kko.kakao.com/C1VTVtFsFV"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#000',
              }}
            >
              <img
                src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ba/45/6c/ba456ce5-e8cb-daf1-4afc-8ef96f2aeb9f/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/434x0w.webp"
                alt="Kakao Map"
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: '50%',
                  background: '#f1f1f1',
                  objectFit: 'cover',
                  marginBottom: '6px',
                }}
              />
              <span style={{ fontSize: 14 }}>
                {lang === 'ko' ? '카카오맵' : 'Kakao Map'}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

