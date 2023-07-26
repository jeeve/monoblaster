import { useEffect, useState } from "react";

function Sprite({ x, y, image }) {
  const style = {
    left: x,
    top: y,
    zIndex:
      image === "grass.png" || image === ""
        ? 0
        : image === "bomb1.png"
        ? 100
        : 10,
  };

  return <img style={style} src={image} alt="" />;
}

export default function Game() {
  const [decor, setDecor] = useState([]);
  const [player, setPlayer] = useState({ x: 150, y: 100 });

  useEffect(() => {
    setDecor(makeDecor());
  }, []);

  function makeDecor() {
    const rows = [];
    for (let i = 0; i < nj; i++) {
      const columns = [];
      for (let j = 0; j < ni; j++) {
        if (i === 0 || i === nj - 1 || j === 0 || j === ni - 1) {
          columns.push("rock.png");
        } else {
          const k = Math.random();
          if (k > 0.2 && k <= 0.4) {
            columns.push("rock.png");
          } else if (k >= 0.4 && k < 0.6) {
            columns.push("brick.png");
          } else {
            columns.push("");
          }
        }
      }
      rows.push(columns);
    }
    return rows;
  }

  function tryToGoLeft() {
    const i = Math.floor((player.x - dx) / 32);
    const j = Math.floor(player.y / 32);
    if (player.y % 32 === 0) {
      if (decor[j][i] === "") {
        setPlayer({ ...player, x: getRoundLessToBlock(player.x - dx) });
      }
    } else {
      if (decor[j][i] === "" && decor[j + 1][i] === "") {
        setPlayer({ ...player, x: getRoundLessToBlock(player.x - dx) });
      } else if (player.y % 32 <= 10 && decor[j][i] === "") {
        setPlayer({
          ...player,
          y: getRoundMore(player.y),
          x: getRoundLessToBlock(player.x - dx),
        });
      } else if (player.y % 32 >= 32 - 10 && decor[j + 1][i] === "") {
        setPlayer({
          ...player,
          y: getRoundLess(player.y),
          x: getRoundLessToBlock(player.x - dx),
        });
      }
    }
  }

  function tryToGoRight() {
    const i = Math.floor((player.x + 32 + dx) / 32);
    const j = Math.floor(player.y / 32);
    if (player.y % 32 === 0) {
      if (decor[j][i] === "") {
        setPlayer({ ...player, x: getRoundMoreToBlock(player.x + dx) });
      }
    } else {
      if (decor[j][i] === "" && decor[j + 1][i] === "") {
        setPlayer({ ...player, x: getRoundMoreToBlock(player.x + dx) });
      } else if (player.y % 32 <= 10 && decor[j][i] === "") {
        setPlayer({
          ...player,
          y: getRoundMore(player.y),
          x: getRoundMoreToBlock(player.x + dx),
        });
      } else if (player.y % 32 >= 32 - 10 && decor[j + 1][i] === "") {
        setPlayer({
          ...player,
          y: getRoundLess(player.y),
          x: getRoundMoreToBlock(player.x + dx),
        });
      }
    }
  }

  function tryToGoUp() {
    const i = Math.floor(player.x / 32);
    const j = Math.floor((player.y - dx) / 32);
    if (player.x % 32 === 0) {
      if (decor[j][i] === "") {
        setPlayer({ ...player, y: getRoundLessToBlock(player.y - dx) });
      }
    } else {
      if (decor[j][i] === "" && decor[j][i + 1] === "") {
        setPlayer({ ...player, y: getRoundLessToBlock(player.y - dx) });
      } else if (player.x % 32 <= 10 && decor[j][i] === "") {
        setPlayer({
          ...player,
          x: getRoundMore(player.x),
          y: getRoundLessToBlock(player.y - dx),
        });
      } else if (player.x % 32 >= 32 - 10 && decor[j][i + 1] === "") {
        setPlayer({
          ...player,
          x: getRoundLess(player.x),
          y: getRoundLessToBlock(player.y - dx),
        });
      }
    }
  }

  function tryToGoDown() {
    const i = Math.floor(player.x / 32);
    const j = Math.floor((player.y + 32 + dx) / 32);
    if (player.x % 32 === 0) {
      if (decor[j][i] === "") {
        setPlayer({ ...player, y: getRoundMoreToBlock(player.y + dx) });
      }
    } else {
      if (decor[j][i] === "" && decor[j][i + 1] === "") {
        setPlayer({ ...player, y: getRoundMoreToBlock(player.y + dx) });
      } else if (player.x % 32 <= 10 && decor[j][i] === "") {
        setPlayer({
          ...player,
          x: getRoundMore(player.x),
          y: getRoundMoreToBlock(player.y + dx),
        });
      } else if (player.x % 32 >= 32 - 10 && decor[j][i + 1] === "") {
        setPlayer({
          ...player,
          x: getRoundLess(player.x),
          y: getRoundMoreToBlock(player.y + dx),
        });
      }
    }
  }

  function dropBomb() {
    const nextDecor = [...decor];
    const i = Math.round(player.x / 32);
    const j = Math.round(player.y / 32);
    nextDecor[j][i] = "bomb1.png";
    setDecor(nextDecor);
  }

  function handleKeyDown(event) {
    if (event.code === "ArrowLeft") {
      tryToGoLeft();
    }
    if (event.code === "ArrowRight") {
      tryToGoRight();
    }
    if (event.code === "ArrowDown") {
      tryToGoDown();
    }
    if (event.code === "ArrowUp") {
      tryToGoUp();
    }
    if (event.code === "Space") {
      dropBomb();
    }
  }

  return (
    <div onKeyDown={handleKeyDown} className="game" tabIndex="0">
      {decor.map((row, i) => (
        <div key={i}>
          {row.map((column, j) => (
            <Sprite
              key={j}
              x={j * 32}
              y={i * 32}
              image={column === "" || column === "bomb1.png" ? "grass.png" : column}
            />
          ))}
        </div>
      ))}
      <Sprite x={player.x} y={player.y} image="player.png" />
      {decor.map((row, i) => (
        <div key={i}>
          {row.map((column, j) => column === "bomb1.png" ?
            <Sprite
              key={j}
              x={j * 32}
              y={i * 32}
              image={column}
            /> : <></>
          )}
        </div>
      ))}
    </div>
  );
}

const ni = 20;
const nj = 15;
const dx = 5;

function getRoundLess(x) {
  return x + 32 - (x % 32);
}

function getRoundLessToBlock(x) {
  if (x % 32 <= dx) {
    return getRoundMore(x);
  }
  return x;
}

function getRoundMore(x) {
  return 32 * Math.floor(x / 32);
}

function getRoundMoreToBlock(x) {
  if (x % 32 >= 32 - dx) {
    return getRoundLess(x);
  }
  return x;
}
