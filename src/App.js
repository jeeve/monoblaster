import { useEffect, useState } from "react";
import Sprite from "./components/Sprite";
import Bomb from "./components/Bomb";
import Fire from "./components/Fire";
import Score from "./components/Score";
import Player from "./components/Player";
import Controls from "./components/Controls";
import * as init from "./init";
import * as util from "./util";
import * as engine from "./engine";
import * as robot from "./robot";

export default function Game() {
  const [soundOn, setSoundOn] = useState(false);
  const [decor, setDecor] = useState([]);
  const [decorOK, setDecorOK] = useState(false);
  const [players, setPlayers] = useState([
    { x: 0, y: 0, score: 0, dead: false, image: "player.png" },
    { x: 0, y: 0, score: 0, dead: false, image: "robot.png" },
  ]);
  const [fires, setFires] = useState([]);
  const [displacement, setDisplacement] = useState("");
  const [robotInertia, setRobotInertia] = useState({
    d: "left",
    t: init.robotAgitation,
  });

  const handleSoundOnChange = () => {
    setSoundOn(!soundOn);
  };

  const myPlayer = () => {
    return players[0];
  };

  const theRobot = () => {
    return players[1];
  };

  function dropBomb(player) {
    if (player.dead) return;
    const nextDecor = [...decor];
    const i = Math.round(player.x / 32);
    const j = Math.round(player.y / 32);
    const n = util.getIndex(i, j);
    if (decor[n].image === "") {
      const x = util.getI(n) * 32;
      const y = util.getJ(n) * 32;
      nextDecor[n] = {
        x: x,
        y: y,
        image: "bomb1.png",
        n: n,
      };
      setDecor(nextDecor);
      player.x = x;
      player.y = y;
    }
  }

  function handleControlDisplacement(displacement) {
    setDisplacement(displacement);
  }

  function handleControlBomb() {
    dropBomb(myPlayer());
  }

  function handleKeyDown(event) {
    if (event.code === "ArrowLeft") {
      event.preventDefault();
      setDisplacement(() => "left");
    }
    if (event.code === "ArrowRight") {
      event.preventDefault();
      setDisplacement(() => "right");
    }
    if (event.code === "ArrowDown") {
      event.preventDefault();
      setDisplacement(() => "down");
    }
    if (event.code === "ArrowUp") {
      event.preventDefault();
      setDisplacement(() => "up");
    }
    if (event.code === "Space") {
      event.preventDefault();
      dropBomb(myPlayer());
    }
  }

  function handleKeyUp(event) {
    if (event.code === "ArrowLeft" && displacement === "left") {
      event.preventDefault();
      setDisplacement(() => "");
    }
    if (event.code === "ArrowRight" && displacement === "right") {
      event.preventDefault();
      setDisplacement(() => "");
    }
    if (event.code === "ArrowDown" && displacement === "down") {
      event.preventDefault();
      setDisplacement(() => "");
    }
    if (event.code === "ArrowUp" && displacement === "up") {
      event.preventDefault();
      setDisplacement(() => "");
    }
  }

  const startTimer = () => {
    return setInterval(() => {
      switch (displacement) {
        case "left": {
          engine.tryToGoLeft(decor, players, myPlayer());
          break;
        }
        case "right": {
          engine.tryToGoRight(decor, players, myPlayer());
          break;
        }
        case "down": {
          engine.tryToGoDown(decor, players, myPlayer());
          break;
        }
        case "up": {
          engine.tryToGoUp(decor, players, myPlayer());
          break;
        }
        default: {
          break;
        }
      }
    }, 20);
  };

  const robotTimer = () => {
    return setInterval(() => {
      robot.moveRobot(decor, robotInertia, setRobotInertia, players, theRobot, dropBomb, fires);
    }, 20);
  };

  const handleExplode = (n) => {
    const newPlayers = [...players];
    newPlayers.map((player) => {
      if (
        Math.abs(player.x - util.getI(n) * 32) < 16 &&
        Math.abs(player.y - util.getJ(n) * 32) < 16
      ) {
        player.dead = true;
        if (player.image === "player.png") {
          players[1].score++;
        } else {
          players[0].score++;
        }
      }
    });
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
      if (
        Math.abs(player.x - util.getI(n) * 32) < 16 &&
        Math.abs(player.y - util.getJ(n) * 32) < 16
      ) {
        if (!player.dead) {
          player.dead = true;
          if (player.image === "player.png") {
            players[1].score++;
          } else {
            players[0].score++;
          }
        }
      }
    });
    setPlayers(newPlayers);
    if (decor[n].image === "brick.png") {
      const newDecor = [...decor];
      newDecor[n].image = "";
      setDecor(newDecor);
    } else if (decor[n].image.includes("bomb")) {
      decor[n].explode = true; // chain reaction
    }
  };

  const handleReborn = (n) => {
    const newPlayers = [...players];
    newPlayers[n].dead = false;
    setPlayers(newPlayers);
  };

  useEffect(() => {
    setDecor(init.makeDecor(setDecorOK));
  }, []);

  useEffect(() => {
    if (!decorOK) return;
    const p = [...players];
    let r = util.emptyRandomPosition(decor);
    if (r.x > -1) {
      p[0] = {
        x: r.x * 32,
        y: r.y * 32,
        score: 0,
        dead: false,
        image: "player.png",
      };
    }
    r = util.emptyRandomPosition(decor);
    if (r.x > -1) {
      p[1] = {
        x: r.x * 32,
        y: r.y * 32,
        score: 0,
        dead: false,
        image: "robot.png",
      };
    }
    setPlayers(p);
  }, [decorOK]);

  useEffect(() => {
    const interval = robotTimer();
    return () => {
      clearInterval(interval);
    };
  }, [decor, players, displacement, robotInertia]);

  useEffect(() => {
    const interval = startTimer();
    return () => {
      clearInterval(interval);
    };
  }, [decor, players, displacement]);

  return (
    <>
      <div id="infos">
        <div className="score score1">
          <Score n={myPlayer().score}></Score>
        </div>
        <span id="titre">Metablaster</span>
        <div className="score score2">
          <Score n={theRobot().score}></Score>
        </div>
      </div>
      <div
        id="board"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        tabIndex="0"
        ref={(input) => input && input.focus()}
      >
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
        {players.map((player, n) => (
          <Player
            x={player.x}
            y={player.y}
            n={n}
            dead={player.dead}
            image={player.image}
            onReborn={handleReborn}
          />
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
              soundOn={soundOn}
            />
          ))}
        {fires.map((sprite, n) => (
          <Fire key={n} decor={decor} n={sprite} onBurn={HandleBurn} />
        ))}
      </div>
      <Controls onDisplacement={handleControlDisplacement} onBomb={handleControlBomb}></Controls>    
      <div id="parameters">
          <input type="checkbox" checked={soundOn} onChange={handleSoundOnChange} name="sound" />
          <label for="sound">
            sound
        </label>
      </div>
      <div id="auteur">
        <a href="https://greduvent.herokuapp.com/" target="_blank">
          by jeeve
        </a>
      </div>
    </>
  );
}
