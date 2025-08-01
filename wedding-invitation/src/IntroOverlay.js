import './App.css'; // 스타일 연결

function IntroOverlay() {
  return (
    <div className="overlay">
     <svg
  viewBox="0 0 500 150"
  className="svg-handwriting"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M10,80 C40,10 90,10 120,80 S190,150 220,80"
    fill="none"
    stroke="hotpink"
    strokeWidth="4"
  />
</svg>
    </div>
  );
}

export default IntroOverlay;