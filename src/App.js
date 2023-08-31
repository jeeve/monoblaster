import { useEffect, useState } from "react";
import Sprite from "./components/Sprite";
import Bomb from "./components/Bomb";
import Fire from "./components/Fire";
import Score from "./components/Score";
import Player from "./components/Player";
import * as Init from "./Init";
import * as Util from "./Util";
import * as Engine from "./Engine";

export default function Game() {
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
    t: Init.robotAgitation,
  });

  const myPlayer = () => {
    return players[0];
  };

  const setMyPlayer = (newPlayer) => {
    const newPlayers = [...players];
    newPlayers[0] = newPlayer;
    setPlayers(newPlayers);
  };

  const robot = () => {
    return players[1];
  };

  const setRobot = (newPlayer) => {
    const newPlayers = [...players];
    newPlayers[1] = newPlayer;
    setPlayers(newPlayers);
  };

  function dropBomb(player) {
    if (player.dead) return;
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
      player.x = x;
      player.y = y;
    }
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
          Engine.tryToGoLeft(decor, players, myPlayer(), setMyPlayer);
          break;
        }
        case "right": {
          Engine.tryToGoRight(decor, players, myPlayer(), setMyPlayer);
          break;
        }
        case "down": {
          Engine.tryToGoDown(decor, players, myPlayer(), setMyPlayer);
          break;
        }
        case "up": {
          Engine.tryToGoUp(decor, players, myPlayer(), setMyPlayer);
          break;
        }
        default: {
          break;
        }
      }
    }, 10);
  };

  const robotTimer = () => {
    return setInterval(() => {
      moveRobot();
    }, 10);
  };

  function moveRobot() {
    const iRobot = Math.floor(robot().x / 32);
    const jRobot = Math.floor(robot().y / 32);
    const nRobot = Util.getIndex(iRobot, jRobot);

    if (
      Util.danger(Util.spriteLeft(nRobot), decor, fires) ||
      Util.danger(Util.spriteRight(nRobot), decor, fires)
    ) {
      if (!Util.something(decor, players, robot(), Util.spriteUp(nRobot))) {
        Engine.tryToGoUp(decor, players, robot(), setRobot);
      } else {
        Engine.tryToGoDown(decor, players, robot(), setRobot);
      }
    }

    if (
      Util.danger(Util.spriteUp(nRobot), decor, fires) ||
      Util.danger(Util.spriteDown(nRobot), decor, fires)
    ) {
      if (!Util.something(decor, players, robot(), Util.spriteLeft(nRobot))) {
        Engine.tryToGoLeft(decor, players, robot(), setRobot);
      } else {
        Engine.tryToGoRight(decor, players, robot(), setRobot);
      }
    }

    if (robotInertia.t > 0) {
      if (robotInertia.d === "up") {
        Engine.tryToGoUp(decor, players, robot(), setRobot);
      }
      if (robotInertia.d === "down") {
        Engine.tryToGoDown(decor, players, robot(), setRobot);
      }
      if (robotInertia.d === "left") {
        Engine.tryToGoLeft(decor, players, robot(), setRobot);
      }
      if (robotInertia.d === "right") {
        Engine.tryToGoRight(decor, players, robot(), setRobot);
      }
    } else {
      const r = Math.round(Math.random() * 100);
      const t = Math.round(Math.random() * Init.robotAgitation);
      if (r > 0 && r <= 10) {
        setRobotInertia({ d: "up", t: t });
      } else if (r > 10 && r <= 20) {
        setRobotInertia({ d: "down", t: t });
      } else if (r > 20 && r <= 30) {
        setRobotInertia({ d: "left", t: t });
      } else if (r > 30 && r <= 40) {
        setRobotInertia({ d: "right", t: t });
      } else if (r > 40 && r <= 42) {
        dropBomb(robot());
      }
    }
    setRobotInertia((old) => {
      return { d: old.d, t: old.t - 1 };
    });
  }

  const handleExplode = (n) => {
    const newPlayers = [...players];
    newPlayers.map((player) => {
      if (
        Math.abs(player.x - Util.getI(n) * 32) < 16 &&
        Math.abs(player.y - Util.getJ(n) * 32) < 16
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
        Math.abs(player.x - Util.getI(n) * 32) < 16 &&
        Math.abs(player.y - Util.getJ(n) * 32) < 16
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
    setDecor(Init.makeDecor(setDecorOK));
  }, []);

  useEffect(() => {
    if (!decorOK) return;
    const p = [...players];
    let r = Util.emptyRandomPosition(decor);
    if (r.x > -1) {
      p[0] = {
        x: r.x * 32,
        y: r.y * 32,
        score: 0,
        dead: false,
        image: "player.png",
      };
    }
    r = Util.emptyRandomPosition(decor);
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
          <Score n={robot().score}></Score>
        </div>
      </div>
      <div
        id="board"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        tabIndex="0"
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
            />
          ))}
        {fires.map((sprite, n) => (
          <Fire key={n} decor={decor} n={sprite} onBurn={HandleBurn} />
        ))}
      </div>
      <div id="controles">
        <button
          type="button"
          className="controle"
          id="bouton-haut"
          onMouseDown={() => setDisplacement(() => "up")}
          onMouseUp={() => setDisplacement(() => "")}
          onTouchStart={() => setDisplacement(() => "up")}
          onTouchEnd={() => setDisplacement(() => "")}
        >
          ↑
        </button>
        <div>
          <button
            type="button"
            className="controle"
            id="bouton-gauche"
            onMouseDown={() => setDisplacement(() => "left")}
            onMouseUp={() => setDisplacement(() => "")}
            onTouchStart={() => setDisplacement(() => "left")}
            onTouchEnd={() => setDisplacement(() => "")}
          >
            ←
          </button>
          <button
            type="button"
            className="controle"
            id="bouton-bombe"
            onClick={() => {
              dropBomb(myPlayer());
            }}
          >
            bomb
          </button>
          <button
            type="button"
            className="controle"
            id="bouton-droite"
            onMouseDown={() => setDisplacement(() => "right")}
            onMouseUp={() => setDisplacement(() => "")}
            onTouchStart={() => setDisplacement(() => "right")}
            onTouchEnd={() => setDisplacement(() => "")}
          >
            →
          </button>
        </div>
        <button
          type="button"
          className="controle"
          id="bouton-bas"
          onMouseDown={() => setDisplacement(() => "down")}
          onMouseUp={() => setDisplacement(() => "")}
          onTouchStart={() => setDisplacement(() => "down")}
          onTouchEnd={() => setDisplacement(() => "")}
        >
          ↓
        </button>
      </div>
      <div id="auteur">
        <a href="https://greduvent.herokuapp.com/" target="_blank">
          by jeeve
        </a>
      </div>
    </>
  );
}
