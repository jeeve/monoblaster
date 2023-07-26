import { useEffect, useState } from "react";

function Sprite({ x, y, image }) {
  const style = {
    left: x,
    top: y,
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
    const sprites = [];
    for (let i = 0; i < nj; i++) {
      for (let j = 0; j < ni; j++) {
        if (i === 0 || i === nj - 1 || j === 0 || j === ni - 1) {
          sprites.push({
            x: getI(sprites.length) * 32,
            y: getJ(sprites.length) * 32,
            image: "rock.png",
          });
        } else {
          const k = Math.random();
          if (k > 0.2 && k <= 0.3) {
            sprites.push({
              x: getI(sprites.length) * 32,
              y: getJ(sprites.length) * 32,
              image: "rock.png",
            });
          } else if (k >= 0.3 && k < 0.5) {
            sprites.push({
              x: getI(sprites.length) * 32,
              y: getJ(sprites.length) * 32,
              image: "brick.png",
            });
          } else {
            sprites.push({
              x: getI(sprites.length) * 32,
              y: getJ(sprites.length) * 32,
              image: "",
            });
          }
        }
      }
    }
    return sprites;
  }

  function tryToGoLeft() {
    const i = Math.floor((player.x - dx) / 32);
    const j = Math.floor(player.y / 32);
    if (player.y % 32 === 0) {
      if (decor[getIndex(i, j)].image === "") {
        setPlayer({ ...player, x: getRoundLessToBlock(player.x - dx) });
      }
    } else {
      if (
        decor[getIndex(i, j)].image === "" &&
        decor[getIndex(i, j + 1)].image === ""
      ) {
        setPlayer({ ...player, x: getRoundLessToBlock(player.x - dx) });
      } else if (player.y % 32 <= 10 && decor[getIndex(i, j)].image === "") {
        setPlayer({
          ...player,
          y: getRoundMore(player.y),
          x: getRoundLessToBlock(player.x - dx),
        });
      } else if (
        player.y % 32 >= 32 - 10 &&
        decor[getIndex(i, j + 1)].image === ""
      ) {
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
      if (decor[getIndex(i, j)].image === "") {
        setPlayer({ ...player, x: getRoundMoreToBlock(player.x + dx) });
      }
    } else {
      if (
        decor[getIndex(i, j)].image === "" &&
        decor[getIndex(i, j + 1)].image === ""
      ) {
        setPlayer({ ...player, x: getRoundMoreToBlock(player.x + dx) });
      } else if (player.y % 32 <= 10 && decor[getIndex(i, j)].image === "") {
        setPlayer({
          ...player,
          y: getRoundMore(player.y),
          x: getRoundMoreToBlock(player.x + dx),
        });
      } else if (
        player.y % 32 >= 32 - 10 &&
        decor[getIndex(i, j + 1)].image === ""
      ) {
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
      if (decor[getIndex(i, j)].image === "") {
        setPlayer({ ...player, y: getRoundLessToBlock(player.y - dx) });
      }
    } else {
      if (
        decor[getIndex(i, j)].image === "" &&
        decor[getIndex(i + 1, j)].image === ""
      ) {
        setPlayer({ ...player, y: getRoundLessToBlock(player.y - dx) });
      } else if (player.x % 32 <= 10 && decor[getIndex(i, j)].image === "") {
        setPlayer({
          ...player,
          x: getRoundMore(player.x),
          y: getRoundLessToBlock(player.y - dx),
        });
      } else if (
        player.x % 32 >= 32 - 10 &&
        decor[getIndex(i + 1, j)].image === ""
      ) {
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
      if (decor[getIndex(i, j)].image === "") {
        setPlayer({ ...player, y: getRoundMoreToBlock(player.y + dx) });
      }
    } else {
      if (
        decor[getIndex(i, j)].image === "" &&
        decor[getIndex(i + 1, j)].image === ""
      ) {
        setPlayer({ ...player, y: getRoundMoreToBlock(player.y + dx) });
      } else if (player.x % 32 <= 10 && decor[getIndex(i, j)] === "") {
        setPlayer({
          ...player,
          x: getRoundMore(player.x),
          y: getRoundMoreToBlock(player.y + dx),
        });
      } else if (
        player.x % 32 >= 32 - 10 &&
        decor[getIndex(i + 1, j)].image === ""
      ) {
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
    nextDecor[getIndex(i, j)] = {
      x: getRoundMore(player.x),
      y: getRoundMore(player.y),
      image: "bomb1.png",
    };
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
      {decor
        .filter((sprite) => {
          return sprite.image !== "bomb1.png";
        })
        .map((sprite, n) => (
          <Sprite
            key={n}
            x={sprite.x}
            y={sprite.y}
            image={
              sprite.image === "" || sprite.image === "bomb1.png"
                ? "grass.png"
                : sprite.image
            }
          />
        ))}
      <Sprite x={player.x} y={player.y} image="player.png" />
      {decor
        .filter((sprite) => {
          return sprite.image === "bomb1.png";
        })
        .map((sprite, n) => (
          <Sprite key={n} x={sprite.x} y={sprite.y} image={sprite.image} />
        ))}
    </div>
  );
}

const ni = 20;
const nj = 15;
const dx = 5;

function getIndex(i, j) {
  return j * ni + i;
}

function getI(n) {
  return n % ni;
}

function getJ(n) {
  return Math.floor(n / ni);
}

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
