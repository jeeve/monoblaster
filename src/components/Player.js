import { useState, useEffect } from "react";
import * as Init from "../Init";

export default function Player({ x, y, n, image, dead, onReborn }) {
  const [img, setImg] = useState(image);
  const [count, setCount] = useState(6);

  const deltax = Math.floor(window.innerWidth / 2 - (Init.ni * 32) / 2);
  const style = {
    left: deltax + x,
    top: y,
  };

  const startTimer = () => {
    return setInterval(() => {
      if (dead) {
        setCount((prevCount) => prevCount - 1);
        setImg((prevImage) => (prevImage === "" ? image : ""));
      }
    }, 200);
  };

  useEffect(() => {
    if (dead && count === 0) {
      onReborn(n);
    }
  }, [dead, count]);

  useEffect(() => {
    if (dead) {
      const interval = startTimer();

      return () => {
        clearInterval(interval);
      };
    }
  }, [dead]);

  return <img style={style} src={"/images/" + img} alt="" />;
}
