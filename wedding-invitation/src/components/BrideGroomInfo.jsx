import React, { useState } from "react";
import "./BrideGroomInfo.css";

const BrideGroomInfo = ({ lang }) => {

  return (
    <section className="bridegroom-wrapper">

      <div className="person-section" data-aos="fade-up">
        <div className="badge">신랑</div>
        <div className="name">{lang === "ko" ? "제이미" : "Jamie"}</div>
        <div className="roman">{lang === "ko" ? "Jamie" : ""}</div>
        <div className="parents">
          {lang === "ko"
            ? <>Gary <span style={{color: "##b2b2b2", margin: "5px 0"}}>  |  </span> Morak<br /><span style={{ color: "#919191" }}>아들</span></>
            : <><span style={{ color: "#919191" }}>Son of</span> <br /> Gary<span className="flower"> | </span> Morak</>
          }
        </div>
      </div>

      <hr className="divider" />

      <div className="person-section" data-aos="fade-up">
        <div className="badge">신부</div>
        <div className="name">{lang === "ko" ? "명진" : "Taylor"}</div>
        <div className="roman">{lang === "ko" ? "Myungjin" : "Myungjin"}</div>
        <div className="parents">
          {lang === "ko"
            ? <>김재득 <span style={{color: "##b2b2b2", margin: "5px 0"}}>|</span> 심경자<br /><span style={{color: "##b2b2b2"}}><span style={{ color: "#919191" }}>딸</span></span></>
            : <><span style={{ color: "#919191" }}>Daughter of</span> <br /> Jaedeuk <span className="flower">|</span> Kyungja</>
          }
        </div>
      </div>
    </section>
  );
};

export default BrideGroomInfo;