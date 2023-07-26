import { useState, useEffect } from "react";

export default function Bomb({ x, y }) {

    const [image, setImage] = useState("bomb1.png");
  
    const style = {
      left: x,
      top: y,
    };
    
    const startTimer = () => {
      return setInterval(() => {
        setImage((prevImage) => (prevImage === "bomb1.png" ? "bomb2.png" : "bomb1.png"));
      }, 200);
    };
  
    useEffect(() => {
      const interval = startTimer();
  
      return () => {
        clearInterval(interval);
      };
    }, []);
  
    return <img style={style} src={image} alt="" />;
  }