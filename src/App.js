import { useEffect, useState } from "react";
import Sprite from "./components/Sprite";
import Bomb from "./components/Bomb";
import Fire from "./components/Fire";
import * as Init from "./Init";
import * as Util from "./Util";
import * as Engine from "./Engine";

export default function Game() {
  const [decor, setDecor] = useState([]);
  const [players, setPlayers] = useState([{ x: 5*32, y: 3*32, dead: false }, { x: 10*32, y: 5*32, dead: false }]);
  const [fires, setFires] = useState([]);
  const [displacement, SetDisplacement] = useState("");

  const myPlayer = () => {
    return players[0];
  }

  const setMyPlayer = (newPlayer) => {
    const newPlayers = [...players];
    newPlayers[0] = newPlayer;
    setPlayers(newPlayers);
  }

  const robot = () => {
    return players[1];
  }

  const setRobot = (newPlayer) => {
    const newPlayers = [...players];
    newPlayers[1] = newPlayer;
    setPlayers(newPlayers);
  }

  useEffect(() => {
    setDecor(Init.makeDecor());
  }, []);

  useEffect(() => {
    if (decor.length === 0) return;
    let r = Util.emptyRandomPosition(decor, -1, -1);
    if (r.x > -1) {
      setMyPlayer({ x: r.x*32, y: r.y*32, dead: false });
    }
    r = Util.emptyRandomPosition(decor, r.x, r.y);
    if (r.x > -1) {
      setRobot({ x: r.x*32, y: r.y*32, dead: false });
    }
  }, [decor]);

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
    const newPlayers = [...players];
    newPlayers.map((player) => {
      if (Math.abs(player.x - Util.getI(n) * 32) < 16 && Math.abs(player.y - Util.getJ(n) * 32) < 16) {
        player.dead = true;
      }});
    setPlayers(newPlayers);
    const newDecor = [...decor];
    newDecor[n].image = ""; // remove bomb
    setDecor(newDecor);
    const newFires = [...fires];
    newFires.push(n);
    setFires(newFires);
  };

  const HandleBurn = (n) => {
    const newPlayers = [...players];
    newPlayers.map((player) => {
      if (Math.abs(player.x - Util.getI(n) * 32) < 16 && Math.abs(player.y - Util.getJ(n) * 32) < 16) {
        player.dead = true;
      }});
    setPlayers(newPlayers);
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
