import { useEffect, useState } from "react";
import Sprite from "./components/Sprite";
import Bomb from "./components/Bomb";
import Fire from "./components/Fire";
import * as Init from "./Init";
import * as Util from "./Util";
import * as Engine from "./Engine";

export default function Game() {
  const [decor, setDecor] = useState([]);
  const [player, setPlayer] = useState({ x: 150, y: 100 });
  const [fires, setFires] = useState([]);

  useEffect(() => {
    setDecor(Init.makeDecor());
  }, []);

  function dropBomb() {
    const nextDecor = [...decor];
    const i = Math.round(player.x / 32);
    const j = Math.round(player.y / 32);
    const n = Util.getIndex(i, j);
    if (decor[n].image === "") {
      const x = Util.getI(n) * 32;
      const y = Util.getJ(n) * 32;
      nextDecor[n] = {
        x: x,
        y: y,
        image: "bomb1.png",
        n: n,
      };
      setDecor(nextDecor);
      setPlayer({ ...player, x, y });
    }
  }

  function handleKeyDown(event) {
    if (event.code === "ArrowLeft") {
      Engine.tryToGoLeft(decor, player, setPlayer);
    }
    if (event.code === "ArrowRight") {
      Engine.tryToGoRight(decor, player, setPlayer);
    }
    if (event.code === "ArrowDown") {
      Engine.tryToGoDown(decor, player, setPlayer);
    }
    if (event.code === "ArrowUp") {
      Engine.tryToGoUp(decor, player, setPlayer);
    }
    if (event.code === "Space") {
      dropBomb();
    }
  }

  const handleExplode = (n) => {
    const newDecor = [...decor];
    newDecor[n].image = "";
    setDecor(newDecor);
    const newFires = [...fires];
    newFires.push(n);
    setFires(newFires);
  };

  return (
    <div onKeyDown={handleKeyDown} className="game" tabIndex="0">
      {decor.map((sprite, n) => (
        <Sprite
          key={n}
          x={sprite.x}
          y={sprite.y}
          image={
            sprite.image === "" || sprite.image.includes("bomb")
              ? "grass.png"
              : sprite.image
          }
        />
      ))}
      <Sprite x={player.x} y={player.y} image="player.png" />
      {decor
        .filter((sprite) => {
          return sprite.image.includes("bomb");
        })
        .map((sprite) => (
          <Bomb
            key={sprite.n}
            x={sprite.x}
            y={sprite.y}
            n={sprite.n}
            onExplode={handleExplode}
          />
        ))}
      {fires.map((sprite, n) => (
        <Fire key={n} decor={decor} n={sprite} />
      ))}
    </div>
  );
}
