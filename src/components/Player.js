import { useState, useEffect } from "react";
import * as Init from "../Init";

export default function Player({ x, y, n, image, dead, onReborn }) {
  const deadTime = 20;
  const [img, setImg] = useState(image);
  const [count, setCount] = useState(deadTime);

  const deltax = Math.floor(window.innerWidth / 2 - (Init.ni * 32) / 2);
  const style = {
    left: deltax + x,
    top: y,
  };
  let interval;

  const startTimer = () => {
    return setInterval(() => {
      if (dead) {
        setCount((prevCount) => prevCount - 1);
        setImg((prevImage) => (prevImage === "" ? image : ""));
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

  return <img style={style} src={"/images/" + img} alt="" />;
}
