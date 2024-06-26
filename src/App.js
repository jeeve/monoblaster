import { useEffect, useState } from "react";
import Sprite from "./components/Sprite";
import Bomb from "./components/Bomb";
import Fire from "./components/Fire";
import Score from "./components/Score";
import Player from "./components/Player";
import Controls from "./components/Controls";
import Help from "./components/Help";
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
    const nextDecor = Object.assign([], decor);
    const i = Math.round(player.x / 32);
    const j = Math.round(player.y / 32);
    const n = util.getIndex(i, j);
    if (decor[n].image === "") {
      const x = util.getI(n) * 32;
      const y = util.getJ(n) * 32;
      if (!util.isOkForXY(decor, players, player, x, y)) {
        return; // on ne peut pas poser à cet endroit
      }
      nextDecor[n] = {
        x: x,
        y: y,
        image: "bomb1.png",
        n: n,
        owner: player.n,
      };
      setDecor(nextDecor);
      const newPlayers = Object.assign([], players);
      newPlayers[player.n].x = x;
      newPlayers[player.n].y = y;
      if (player.bombs > 0) {
        newPlayers[player.n].bombs--;
      }
      setPlayers(newPlayers);
    }
  }

  function handleControlDisplacement(displacement) {
    myPlayer().displacement = displacement;
  }

  function handleControlBomb() {
    dropBomb(myPlayer());
  }

  function handleKeyDown(event) {
    if (event.code === "ArrowLeft") {
      event.preventDefault();
      myPlayer().displacement = "left";
    }
    if (event.code === "ArrowRight") {
      event.preventDefault();
      myPlayer().displacement = "right";
    }
    if (event.code === "ArrowDown") {
      event.preventDefault();
      myPlayer().displacement = "down";
    }
    if (event.code === "ArrowUp") {
      event.preventDefault();
      myPlayer().displacement = "up";
    }
    if (event.code === "Space") {
      event.preventDefault();
      dropBomb(myPlayer());
    }
  }

  function handleKeyUp(event) {
    if (event.code === "ArrowLeft" && myPlayer().displacement === "left") {
      event.preventDefault();
      myPlayer().displacement = "";
    }
    if (event.code === "ArrowRight" && myPlayer().displacement === "right") {
      event.preventDefault();
      myPlayer().displacement = "";
    }
    if (event.code === "ArrowDown" && myPlayer().displacement === "down") {
      event.preventDefault();
      myPlayer().displacement = "";
    }
    if (event.code === "ArrowUp" && myPlayer().displacement === "up") {
      event.preventDefault();
      myPlayer().displacement = "";
    }
  }

  const handleExplode = (n) => {
    let myPlayerScore = myPlayer().score;
    let theRobotScore = theRobot().score;
    const newPlayers = players.map((player) => {
      const newPlayer = { ...player };
      if (
        Math.abs(player.x - util.getI(n) * 32) < 16 &&
        Math.abs(player.y - util.getJ(n) * 32) < 16
      ) {
        newPlayer.dead = true;
        if (player.image === "player.png") {
          theRobotScore++;
        } else {
          myPlayerScore++;
        }
      }
      return newPlayer;
    });
    const newDecor = Object.assign([], decor);
    newDecor[n].image = ""; // remove bomb
    setDecor(newDecor);
    newPlayers[decor[n].owner].bombs++; // on recredite le nombre de bombes dispo
    newPlayers[myPlayer().n].score = myPlayerScore;
    newPlayers[theRobot().n].score = theRobotScore;
    setPlayers(newPlayers);
    const newFires = [...fires];
    newFires.push(n);
    setFires(newFires);
  };

  const HandleBurn = (n) => {
    let myPlayerScore = myPlayer().score;
    let theRobotScore = theRobot().score;
    players.map((player) => {
      if (
        Math.abs(player.x - util.getI(n) * 32) < 16 &&
        Math.abs(player.y - util.getJ(n) * 32) < 16
      ) {
        if (!player.dead) {
          player.dead = true;
          if (player.image === "player.png") {
            theRobotScore++;
          } else {
            myPlayerScore++;
          }
        }
      }
    });
    players[myPlayer().n].score = myPlayerScore;
    players[theRobot().n].score = theRobotScore;
    //setPlayers(newPlayers);
    const newDecor = Object.assign([], decor);
    if (decor[n].image === "brick.png") {
      newDecor[n].image = "";
      setDecor(newDecor);
    } else if (decor[n].image.includes("bomb")) {
      newDecor[n].explode = true; // chain reaction
      setDecor(newDecor);
      const newFires = [...fires];
      fires.push(n);
      setFires(newFires);
    }
  };

  function handleFireEnd(n) {
    setFires(fires.filter((elt) => elt !== n)); // on supprime le fire
  }

  const handleReborn = (n) => {
    const newPlayers = Object.assign([], players);
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
          engine
            .tryToGoLeft(decor, players, theRobot())
            .then((response) => {
              const newPlayers = Object.assign([], players);
              newPlayers[theRobot().n].x = response.x;
              newPlayers[theRobot().n].y = response.y;
              setPlayers(newPlayers);
            });
          break;
        }
        case "right": {
          engine
            .tryToGoRight(decor, players, theRobot())
            .then((response) => {
              const newPlayers = Object.assign([], players);
              newPlayers[theRobot().n].x = response.x;
              newPlayers[theRobot().n].y = response.y;
              setPlayers(newPlayers);
            });
          break;
        }
        case "down": {
          engine
            .tryToGoDown(decor, players, theRobot())
            .then((response) => {
              const newPlayers = Object.assign([], players);
              newPlayers[theRobot().n].x = response.x;
              newPlayers[theRobot().n].y = response.y;
              setPlayers(newPlayers);
            });
          break;
        }
        case "up": {
          engine
            .tryToGoUp(decor, players, theRobot())
            .then((response) => {
              const newPlayers = Object.assign([], players);
              newPlayers[theRobot().n].x = response.x;
              newPlayers[theRobot().n].y = response.y;
              setPlayers(newPlayers);
            });
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
          engine
            .tryToGoLeft(decor, players, myPlayer())
            .then((response) => {
              const newPlayers = Object.assign([], players);
              newPlayers[myPlayer().n].x = response.x;
              newPlayers[myPlayer().n].y = response.y;
              setPlayers(newPlayers);
            });
          break;
        }
        case "right": {
          engine
            .tryToGoRight(decor, players, myPlayer())
            .then((response) => {
              const newPlayers = Object.assign([], players);
              newPlayers[myPlayer().n].x = response.x;
              newPlayers[myPlayer().n].y = response.y;
              setPlayers(newPlayers);
            });
            break;
        }
        case "down": {
          engine
            .tryToGoDown(decor, players, myPlayer())
            .then((response) => {
              const newPlayers = Object.assign([], players);
              newPlayers[myPlayer().n].x = response.x;
              newPlayers[myPlayer().n].y = response.y;
              setPlayers(newPlayers);
            });
          break;
        }
        case "up": {
          engine
            .tryToGoUp(decor, players, myPlayer())
            .then((response) => {
              const newPlayers = Object.assign([], players);
              newPlayers[myPlayer().n].x = response.x;
              newPlayers[myPlayer().n].y = response.y;
              setPlayers(newPlayers);
            });
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
        <span id="titre">Monoblaster</span>
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
          <Fire
            key={n}
            decor={decor}
            n={sprite}
            onBurn={HandleBurn}
            onEnd={handleFireEnd}
          />
        ))}
        <Help ni={32}></Help>
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
