import { useEffect, useState } from "react";
import Sprite from "./Sprite";
import * as Util from "../Util";

export default function Fire({ decor, n, onBurn}) {
  const energyMax = 10;
  const [energy, setEnergy] = useState(energyMax);
  const [spritesL, setSpritesL] = useState([]);
  const [nbBurnedL, setNbBurnedL] = useState(0);

  const startTimer = () => {
    return setInterval(() => {
      setEnergy((prevEnergy) => prevEnergy - 1);
    }, 50);
  };

  useEffect(() => {
    spread();
  }, [energy]);

  const spread = () => {
    if (energy > energyMax / 2) {
      setSpritesL((prevSprites) => {
        const newSprites = [...prevSprites];
        let k;
        if (newSprites.length === 0) {
          k = n;
        } else {
          k = Util.getIndex(
            Math.floor(newSprites[newSprites.length - 1].x / 32),
            Math.floor(newSprites[newSprites.length - 1].y / 32)
          );
        }
        const i = Util.getI(k) - 1;
        const j = Util.getJ(k);
        const newK = Util.getIndex(i, j);
        if (decor[newK].image === "" && nbBurnedL === 0) {
          newSprites.push({
            x: i * 32,
            y: j * 32,
            image: "fire-h-l.png",
          });
        }
        if (newSprites.length > 1) {
          newSprites[newSprites.length - 2].image = "fire-h.png";
        }
        if (decor[newK].image === "brick.png") {
          setNbBurnedL((prevNbBurned) => prevNbBurned + 1);
        }
        if (nbBurnedL === 0) {
          onBurn(newK);
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
  }

  useEffect(() => {
    const interval = startTimer();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {energy > energyMax / 2 + 1 ? (
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
