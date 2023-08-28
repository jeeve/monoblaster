import { useState, useEffect } from "react";

export default function Bomb({ x, y, n, onExplode, explode }) {

    const [image, setImage] = useState("bomb1.png");
    const [count, setCount] = useState(5);
  
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
      if (explode) {
        onExplode(n);
      }
    }, [explode, onExplode]);

    useEffect(() => {
      const interval = startTimer();
  
      return () => {
        clearInterval(interval);
      };
    }, [n]);

    useEffect(() => {
      if (count === 0) {
        onExplode(n);
      }
    }, [count]);
  
    return <img style={style} src={"/images/" + image} alt="" />;
  }