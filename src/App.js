import { useEffect, useState } from "react";

function Sprite({ x, y, image }) {
  const style = {
    left: x,
    top: y,
  };

  return <img style={style} src={image} alt="" />;
}

function Bomb({ i, j }) {
  const style = {
    left: i * 32,
    top: j * 32,
  };

  return <img style={style} src="bomb1.png" alt="" />;
}

export default function Game() {
  const [decor, setDecor] = useState([]);
  const [player, setPlayer] = useState({ x: 150, y: 100 });
  const [bombs, setBombs] = useState([]);

  useEffect(() => {
    setDecor(makeDecor());
  }, []);

  function makeDecor() {
    const rows = [];
    for (let i = 0; i < nj; i++) {
      const columns = [];
      for (let j = 0; j < ni; j++) {
        if (i === 0 || i === nj-1 || j === 0 || j === ni-1) {
          columns.push("rock.png");
        } else {
          const k = Math.random();
          if (k > 0.2 && k <= 0.4) {
            columns.push("rock.png");
          } else if (k >= 0.4 && k < 0.6) {
            columns.push("brick.png");
          }
          else {
            columns.push("grass.png");
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
      if (decor[j][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundLessToBlock(player.x - dx) });
      }
    } else {
      if (decor[j][i] === "grass.png" && decor[j + 1][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundLessToBlock(player.x - dx) });
      } else if (player.y % 32 <= 10 && decor[j][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundMore(player.y), x: getRoundLessToBlock(player.x - dx) });
      } else if (player.y % 32 >= 32 - 10 && decor[j + 1][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundLess(player.y), x: getRoundLessToBlock(player.x - dx) });
      }
    }
  }

  function tryToGoRight() {
    const i = Math.floor((player.x + 32 + dx) / 32);
    const j = Math.floor(player.y / 32);
    if (player.y % 32 === 0) {
      if (decor[j][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundMoreToBlock(player.x + dx) });
      }
    } else {
      if (decor[j][i] === "grass.png" && decor[j + 1][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundMoreToBlock(player.x + dx) });
      } else if (player.y % 32 <= 10 && decor[j][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundMore(player.y), x: getRoundMoreToBlock(player.x + dx) });
      } else if (player.y % 32 >= 32 - 10 && decor[j + 1][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundLess(player.y), x: getRoundMoreToBlock(player.x + dx) });
      }
    }
  }

  function tryToGoUp() {
    const i = Math.floor(player.x / 32);
    const j = Math.floor((player.y - dx) / 32);
    if (player.x % 32 === 0) {
      if (decor[j][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundLessToBlock(player.y - dx) });
      }
    } else {
      if (decor[j][i] === "grass.png" && decor[j][i + 1] === "grass.png") {
        setPlayer({ ...player, y: getRoundLessToBlock(player.y - dx) });
      } else if (player.x % 32 <= 10 && decor[j][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundMore(player.x), y: getRoundLessToBlock(player.y - dx) });
      } else if (player.x % 32 >= 32 - 10 && decor[j][i + 1] === "grass.png") {
        setPlayer({ ...player, x: getRoundLess(player.x), y: getRoundLessToBlock(player.y - dx) });
      }
    }
  }

  function tryToGoDown() {
    const i = Math.floor(player.x / 32);
    const j = Math.floor((player.y + 32 + dx) / 32);
    if (player.x % 32 === 0) {
      if (decor[j][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundMoreToBlock(player.y + dx) });
      }
    } else {
      if (decor[j][i] === "grass.png" && decor[j][i + 1] === "grass.png") {
        setPlayer({ ...player, y: getRoundMoreToBlock(player.y + dx) });
      } else if (player.x % 32 <= 10 && decor[j][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundMore(player.x), y: getRoundMoreToBlock(player.y + dx) });
      } else if (player.x % 32 >= 32 - 10 && decor[j][i + 1] === "grass.png") {
        setPlayer({ ...player, x: getRoundLess(player.x), y: getRoundMoreToBlock(player.y + dx) });
      }
    }
  }

  function dropBomb() {
    const nextBombs = [...bombs];
    nextBombs.push({ i: Math.round(player.x / 32), j: Math.round(player.y / 32) })
    setBombs(nextBombs);
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
      { decor.map((row, i) => (
        <div key={ i }>
          {row.map((column, j) => (
            <Sprite key={ j } x={ j * 32 } y={ i * 32 } image={ column } />
          )) }
        </div>
      )) }
      <Sprite x={ player.x } y={ player. y} image="player.png" />
      { bombs.map((bomb, n) => (
        <Bomb key={ n } i={ bomb.i } j={ bomb.j } />
      )) }
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
