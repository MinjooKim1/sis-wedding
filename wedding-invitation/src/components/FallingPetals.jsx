import React, { useEffect, useState } from "react";
import "./FallingPetals.css"; // 스타일 따로 관리

const PETAL_COUNT = 15;

const FallingPetals = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const newPetals = Array.from({ length: PETAL_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 5 + Math.random() * 5,
      animationDelay: Math.random() * 5,
      size: 20 + Math.random() * 10,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <>
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            animationDuration: `${petal.animationDuration}s`,
            animationDelay: `${petal.animationDelay}s`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            backgroundImage: `url(${process.env.PUBLIC_URL + "/overlay/petal.png"})`,
          }}
        />
      ))}
    </>
  );
};

export default FallingPetals;