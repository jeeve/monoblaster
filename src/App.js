import { useEffect, useState } from "react";
import Sprite from "./components/Sprite";
import Bomb from "./components/Bomb";
import Fire from "./components/Fire";
import * as Init from "./Init";
import * as Util from "./Util";
import * as Engine from "./Engine";

export default function Game() {
  const [decor, setDecor] = useState([]);
  const [players, setPlayers] = useState([{ x: 150, y: 100, dead: false }, { x: 300, y: 150, dead: false }]);
  const [numPlayer, setNumPlayer] = useState(0);
  const [fires, setFires] = useState([]);
  const [displacement, SetDisplacement] = useState("");

  const myPlayer = () => {
    return players[numPlayer];
  }

  const setMyPlayer = (newPlayer) => {
    const newPlayers = [...players];
    newPlayers[numPlayer] = newPlayer;
    setPlayers(newPlayers);
  }

  useEffect(() => {
    setDecor(Init.makeDecor());
  }, []);

  function dropBomb() {
    const nextDecor = [...decor];
    const i = Math.round(myPlayer().x / 32);
    const j = Math.round(myPlayer().y / 32);
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
      setMyPlayer({ ...myPlayer(), x, y });
    }
  }

  function handleKeyDown(event) {
    if (event.code === "ArrowLeft") {
      SetDisplacement(() => "left");
    }
    if (event.code === "ArrowRight") {
      SetDisplacement(() => "right");
    }
    if (event.code === "ArrowDown") {
      SetDisplacement(() => "down");
    }
    if (event.code === "ArrowUp") {
      SetDisplacement(() => "up");
    }
    if (event.code === "Space") {
      dropBomb();
    }
  }
  
  function handleKeyUp(event) {
    if (event.code === "ArrowLeft" && displacement === "left") {
      SetDisplacement(() => "");
    }
    if (event.code === "ArrowRight" && displacement === "right") {
      SetDisplacement(() => "");
    }
    if (event.code === "ArrowDown" && displacement === "down") {
      SetDisplacement(() => "");
    }
    if (event.code === "ArrowUp" && displacement === "up") {
      SetDisplacement(() => "");
    }
  }

  const startTimer = () => {
    return setInterval(() => {
      switch (displacement) {
        case "left" : { 
          Engine.tryToGoLeft(decor, myPlayer(), setMyPlayer);
          break;
        }
        case "right" : {
          Engine.tryToGoRight(decor, myPlayer(), setMyPlayer);
          break;
        }
        case "down" : {
          Engine.tryToGoDown(decor, myPlayer(), setMyPlayer);
          break;
        }
        case "up" : {
          Engine.tryToGoUp(decor, myPlayer(), setMyPlayer);
          break;
        }
        default : {
          break;
        }
      }
    }, 10);
  };

  useEffect(() => {
    const interval = startTimer();

    return () => {
      clearInterval(interval);
    };
  }, [players, displacement]);

  const handleExplode = (n) => {
    players.map((player) => {
      if (Math.abs(player.x - Util.getI(n) * 32) < 16 && Math.abs(player.y - Util.getJ(n) * 32) < 16) {
        player.dead = true;
      }});
    const newDecor = [...decor];
    newDecor[n].image = ""; // remove bomb
    setDecor(newDecor);
    const newFires = [...fires];
    newFires.push(n);
    setFires(newFires);
  };

  const HandleBurn = (n) => {
    players.map((player) => {
      if (Math.abs(player.x - Util.getI(n) * 32) < 16 && Math.abs(player.y - Util.getJ(n) * 32) < 16) {
        player.dead = true;
      }});
    if (decor[n].image === "brick.png") {
      const newDecor = [...decor];
      newDecor[n].image = "";
      setDecor(newDecor);
    } else if (decor[n].image.includes("bomb")) {
      decor[n].explode = true; // chain reaction
    }
  }

  return (
    <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} className="game" tabIndex="0">
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
      {players.filter((player) => { return !player.dead }).map((player, n) => (
      <Sprite x={player.x} y={player.y} image={n===0 ?"player.png" : "robot.png"} />
      ))}
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
            explode={sprite.explode}
          />
        ))}
      {fires.map((sprite, n) => (
        <Fire key={n} decor={decor} n={sprite} onBurn={HandleBurn} />
      ))}
    </div>
  );
}
