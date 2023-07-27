import { useEffect, useState } from "react";
import Sprite from "./Sprite";
import * as Util from "../Util";

export default function Fire({ decor, n }) {
  const [energy, setEnergy] = useState(5);
  const [spritesL, setSpritesL] = useState([]);

  const startTimer = () => {
    return setInterval(() => {
      setEnergy((prevEnergy) => prevEnergy - 1);
    }, 50);
  };

  useEffect(() => {
    if (energy > 0) {
      setSpritesL((prevSprites) => {
        const newSprites = [...prevSprites];
        let k;
        if (newSprites.length === 0) {
            k = n;
        } else {
            k = newSprites[newSprites.length-1].n - 1;
        }
        newSprites.push({
          x: Util.getI(k) * 32,
          y: Util.getJ(k) * 32,
          image: energy == 1 ? "fire-h-l.png" : "fire-h.png",
          n: k
        });
        return newSprites;
      });
    } else {
        setSpritesL([]);
    }
  }, [energy]);

  useEffect(() => {
    const interval = startTimer();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {energy > 0 ? <Sprite x={Util.getI(n) * 32} y={Util.getJ(n) * 32} image="fire-c.png" /> : <></>}
      <>
        {spritesL.map((sprite, n) => (
          <Sprite key={n} x={sprite.x} y={sprite.y} image={sprite.image} />
        ))}
      </>
    </div>
  );
}
