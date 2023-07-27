import { useState, useEffect } from "react";

export default function Bomb({ x, y, n, onExplode }) {

    const [image, setImage] = useState("bomb1.png");
    const [count, setCount] = useState(20);
  
    const style = {
      left: x,
      top: y,
    };
    
    const startTimer = () => {
      return setInterval(() => {
        setCount((prevCount) => prevCount - 1);
        setImage((prevImage) => (prevImage === "bomb1.png" ? "bomb2.png" : "bomb1.png"));
      }, 200);
    };
 
    useEffect(() => {
      const interval = startTimer();
  
      return () => {
        clearInterval(interval);
      };
    }, []);

    useEffect(() => {
      if (count === 0) {
        onExplode(n);
      }
    }, [count]);
  
    return <img style={style} src={image} alt="" />;
  }