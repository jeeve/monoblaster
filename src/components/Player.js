import { useState, useEffect } from "react";
import * as init from "../init";

export default function Player({ x, y, n, image, dead, onReborn }) {
  const deadTime = 20;
  const [opacity, setOpacity] = useState(1);
  const [count, setCount] = useState(deadTime);

  const deltax = Math.floor(window.innerWidth / 2 - (init.ni * 32) / 2);
  const style = {
    left: deltax + x,
    top: y,
    opacity: opacity
  };
  let interval;

  const startTimer = () => {
    return setInterval(() => {
      if (dead) {
        setCount((prevCount) => prevCount - 1);
        setOpacity((prevOpacity) => (prevOpacity === 1 ? 0 : 1));
      }
    }, 200);
  };

  useEffect(() => {
    if (dead) {
      interval = startTimer();

      return () => {
        clearInterval(interval);
      };
    }
  }, [dead]);

  useEffect(() => {
    if (dead && count === 0) {
        clearInterval(interval);
        setCount(deadTime);
        onReborn(n);
    }
  }, [dead, count]);

  return <img style={style} src={"/images/" + image} alt="" />;
}
