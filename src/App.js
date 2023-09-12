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
    {
      x: 0,
      y: 0,
      score: 0,
      dead: false,
      image: "player.png",
      n: 0,
      bombs: init.nbBombsMax,
      displacement: "",
    },
    {
      x: 0,
      y: 0,
      score: 0,
      dead: false,
      image: "robot.png",
      n: 1,
      bombs: init.nbBombsMax,
      displacement: "",
    },
  ]);
  const [fires, setFires] = useState([]);
  const [robotInertia, setRobotInertia] = useState(init.robotAgitation);

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
    if (player.dead || player.bombs === 0) return;
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
        owner: player.n,
      };
      setDecor(nextDecor);
      const newPlayers = Object.assign([], players);
      newPlayers[player.n]. x = x;
      newPlayers[player.n]. y = y;
      if (player.bombs > 0) {
        newPlayers[player.n].bombs--;
      }
      setPlayers(newPlayers);
    }
  }

  function handleControlDisplacement(displacement) {
    const newPlayers = Object.assign([], players);
    newPlayers[myPlayer().n].displacement = displacement;
    setPlayers(newPlayers);
  }

  function handleControlBomb() {
    dropBomb(myPlayer());
  }

  function handleKeyDown(event) {
    if (event.code === "ArrowLeft") {
      event.preventDefault();
      const newPlayers = Object.assign([], players);
      newPlayers[myPlayer().n].displacement = "left";
      setPlayers(newPlayers);
    }
    if (event.code === "ArrowRight") {
      event.preventDefault();
      const newPlayers = Object.assign([], players);
      newPlayers[myPlayer().n].displacement = "right";
      setPlayers(newPlayers);
    }
    if (event.code === "ArrowDown") {
      event.preventDefault();
      const newPlayers = Object.assign([], players);
      newPlayers[myPlayer().n].displacement = "down";
      setPlayers(newPlayers);
    }
    if (event.code === "ArrowUp") {
      event.preventDefault();
      const newPlayers = Object.assign([], players);
      newPlayers[myPlayer().n].displacement = "up";
      setPlayers(newPlayers);
    }
    if (event.code === "Space") {
      event.preventDefault();
      dropBomb(myPlayer());
    }
  }

  function handleKeyUp(event) {
    if (event.code === "ArrowLeft" && myPlayer().displacement === "left") {
      event.preventDefault();
      const newPlayers = Object.assign([], players);
      newPlayers[myPlayer().n].displacement = "";
      setPlayers(newPlayers);
    }
    if (event.code === "ArrowRight" && myPlayer().displacement === "right") {
      event.preventDefault();
      const newPlayers = Object.assign([], players);
      newPlayers[myPlayer().n].displacement = "";
      setPlayers(newPlayers);
    }
    if (event.code === "ArrowDown" && myPlayer().displacement === "down") {
      event.preventDefault();
      const newPlayers = Object.assign([], players);
      newPlayers[myPlayer().n].displacement = "";
      setPlayers(newPlayers);
    }
    if (event.code === "ArrowUp" && myPlayer().displacement === "up") {
      event.preventDefault();
      const newPlayers = Object.assign([], players);
      newPlayers[myPlayer().n].displacement = "";
      setPlayers(newPlayers);
    }
  }

  const handleExplode = (n) => {
    const newPlayers = [...players];
    newPlayers.map((player) => {
      const newPlayer = { ...player };
      if (
        Math.abs(player.x - util.getI(n) * 32) < 16 &&
        Math.abs(player.y - util.getJ(n) * 32) < 16
      ) {
        newPlayer.dead = true;
        const newPlayers = Object.assign([], players);
        if (player.image === "player.png") {
          newPlayers[1].score++;
        } else {
          newPlayers[0].score++;
        }
      }
      return newPlayer;
    });
    setPlayers(newPlayers);
    decor[n].image = ""; // remove bomb
    players[decor[n].owner].bombs++; // on recredite le nombre de bombes dispo
    const newFires = [...fires];
    newFires.push(n);
    setFires(newFires);
  };

  function HandleBurn(n) {
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
    const newDecor = Object.assign([], decor);
    setPlayers(newPlayers);
    if (decor[n].image === "brick.png") {
      newDecor[n].image = "";
    } else if (decor[n].image.includes("bomb")) {
      newDecor[n].explode = true; // chain reaction
      const newFires = [...fires];
      fires.push(n);
      setFires(newFires);
    }
    setDecor(newDecor);
  };

  function handleFireEnd(n) {
    setFires(fires.filter(elt => elt !== n)); // on supprime le fire
  }

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
        n: 0,
        score: 0,
        dead: false,
        image: "player.png",
        bombs: init.nbBombsMax,
        displacement: "",
      };
    }
    r = util.emptyRandomPosition(decor);
    if (r.x > -1) {
      p[1] = {
        x: r.x * 32,
        y: r.y * 32,
        n: 1,
        score: 0,
        dead: false,
        image: "robot.png",
        bombs: init.nbBombsMax,
        displacement: "",
      };
    }
    setPlayers(p);
  }, [decorOK]);

  useEffect(() => {
    const interval = setInterval(() => {
      robot.moveRobot(
        decor,
        robotInertia,
        setRobotInertia,
        players,
        theRobot,
        dropBomb,
        fires
      );
      switch (theRobot().displacement) {
        case "left": {
          engine.tryToGoLeft(decor, players, theRobot(), setPlayers);
          break;
        }
        case "right": {
          engine.tryToGoRight(decor, players, theRobot(), setPlayers);
          break;
        }
        case "down": {
          engine.tryToGoDown(decor, players, theRobot(), setPlayers);
          break;
        }
        case "up": {
          engine.tryToGoUp(decor, players, theRobot(), setPlayers);
          break;
        }
        default: {
          break;
        }
      }
    }, init.speed);
    return () => {
      clearInterval(interval);
    };
  }, [decor, players, robotInertia, fires]);

  useEffect(() => {
    const interval = setInterval(() => {
      switch (myPlayer().displacement) {
        case "left": {
          engine.tryToGoLeft(decor, players, myPlayer(), setPlayers);
          break;
        }
        case "right": {
          engine.tryToGoRight(decor, players, myPlayer(), setPlayers);
          break;
        }
        case "down": {
          engine.tryToGoDown(decor, players, myPlayer(), setPlayers);
          break;
        }
        case "up": {
          engine.tryToGoUp(decor, players, myPlayer(), setPlayers);
          break;
        }
        default: {
          break;
        }
      }
    }, init.speed);
    return () => {
      clearInterval(interval);
    };
  }, [decor, players, fires]);

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
            key={n}
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
          <Fire key={n} decor={decor} n={sprite} onBurn={HandleBurn} onEnd={handleFireEnd} />
        ))}
      </div>
      <Controls
        onDisplacement={handleControlDisplacement}
        onBomb={handleControlBomb}
      ></Controls>
      <div id="parameters">
        <input
          type="checkbox"
          checked={soundOn}
          onChange={handleSoundOnChange}
          name="sound"
        />
        <label htmlFor="sound">sound</label>
      </div>
      <div id="auteur">
        <a href="https://greduvent.herokuapp.com/" target="_blank">
          by jeeve
        </a>
      </div>
    </>
  );
}
