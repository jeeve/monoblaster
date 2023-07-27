import { useEffect, useState } from "react";
import Sprite from "./Sprite";
import * as Util from "../Util";

export default function Fire({ decor, n }) {
  const energyMax = 10;
  const [energy, setEnergy] = useState(energyMax);
  const [spritesL, setSpritesL] = useState([]);

  const startTimer = () => {
    return setInterval(() => {
      setEnergy((prevEnergy) => prevEnergy - 1);
    }, 50);
  };

  useEffect(() => {
    if (energy > energyMax/2) {
      setSpritesL((prevSprites) => {
        const newSprites = [...prevSprites];
        let k;
        if (newSprites.length === 0) {
          k = n;
        } else {
          k = newSprites[newSprites.length - 1].n - 1;
        }
        newSprites.push({
          x: Util.getI(k) * 32,
          y: Util.getJ(k) * 32,
          image: "fire-h-l.png",
          n: k,
        });
        if (newSprites.length > 1) {
            newSprites[newSprites.length-2].image = "fire-h.png";
        }
        return newSprites;
      });
    } else {
        setSpritesL((prevSprites) => {
            const newSprites = [...prevSprites]; 
            newSprites.shift();
            if (newSprites.length > 0) {
                newSprites[0].image = "fire-h-r.png";
            }
            return newSprites;  
        });
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
      {energy > energyMax/2 + 1 ? (
        <Sprite
          x={Util.getI(n) * 32}
          y={Util.getJ(n) * 32}
          image="fire-c.png"
        />
      ) : (
        <></>
      )}
      <>
        {spritesL.map((sprite, n) => (
          <Sprite key={n} x={sprite.x} y={sprite.y} image={sprite.image} />
        ))}
      </>
    </div>
  );
}
