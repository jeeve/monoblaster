import { useEffect, useState } from "react";

function Sprite({ x, y, image }) {
  const style = {
    left: x,
    top: y,
  };

  return <img style={style} src={image} />;
}

export default function Game() {
  const [decor, setDecor] = useState([]);
  const [player, setPlayer] = useState({ x: 150, y: 100 });
  const nx = 20;
  const ny = 15;
  const dx = 5;

  useEffect(() => {
    const rows = [];
    for (let i = 0; i < ny; i++) {
      const columns = [];
      for (let j = 0; j < nx; j++) {
        if (i === 0 || i === ny-1 || j === 0 || j === nx-1) {
          columns.push("rock.png");
        } else {
          if (Math.random() > 0.2) {
            columns.push("grass.png");
          } else {
            columns.push("rock.png");
          }
        }
      }
      rows.push(columns);
    }
    setDecor(rows);
  }, []);

  function getRoundLess(x) {
    return x + 32 - (x % 32);
  }

  function getRoundLess2(x) {
    if (x % 32 <= dx) {
      return 32 * Math.floor(x / 32);
    }
    return x;      
  }

  function getRoundMore2(x) {
    if (x % 32 >= 32 - dx) {
      return x + 32 - (x % 32);
    }
    return x;      
  }

  function getRoundMore(x) {
    return 32 * Math.floor(x / 32);
  }

  function tryToGoLeft() {
    const i = Math.floor((player.x - dx) / 32);
    const j = Math.floor(player.y / 32);
    if (player.y % 32 == 0) {
      if (decor[j][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundLess2(player.x - dx) });
      }
    } else {
      if (decor[j][i] === "grass.png" && decor[j + 1][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundLess2(player.x - dx) });
      } else if (player.y % 32 <= 10 && decor[j][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundMore(player.y), x: getRoundLess2(player.x - dx) });
      } else if (player.y % 32 >= 32 - 10 && decor[j + 1][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundLess(player.y), x: getRoundLess2(player.x - dx) });
      }
    }
  }

  function tryToGoRight() {
    const i = Math.floor((player.x + 32 + dx) / 32);
    const j = Math.floor(player.y / 32);
    if (player.y % 32 == 0) {
      if (decor[j][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundMore2(player.x + dx) });
      }
    } else {
      if (decor[j][i] === "grass.png" && decor[j + 1][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundMore2(player.x + dx) });
      } else if (player.y % 32 <= 10 && decor[j][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundMore(player.y), x: getRoundMore2(player.x + dx) });
      } else if (player.y % 32 >= 32 - 10 && decor[j + 1][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundLess(player.y), x: getRoundMore2(player.x + dx) });
      }
    }
  }

  function tryToGoUp() {
    const i = Math.floor(player.x / 32);
    const j = Math.floor((player.y - dx) / 32);
    if (player.x % 32 == 0) {
      if (decor[j][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundLess2(player.y - dx) });
      }
    } else {
      if (decor[j][i] === "grass.png" && decor[j][i + 1] === "grass.png") {
        setPlayer({ ...player, y: getRoundLess2(player.y - dx) });
      } else if (player.x % 32 <= 10 && decor[j][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundMore(player.x), y: getRoundLess2(player.y - dx) });
      } else if (player.x % 32 >= 32 - 10 && decor[j][i + 1] === "grass.png") {
        setPlayer({ ...player, x: getRoundLess(player.x), y: getRoundLess2(player.y - dx) });
      }
    }
  }

  function tryToGoDown() {
    const i = Math.floor(player.x / 32);
    const j = Math.floor((player.y + 32 + dx) / 32);
    if (player.x % 32 == 0) {
      if (decor[j][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundMore2(player.y + dx) });
      }
    } else {
      if (decor[j][i] === "grass.png" && decor[j][i + 1] === "grass.png") {
        setPlayer({ ...player, y: getRoundMore2(player.y + dx) });
      } else if (player.x % 32 <= 10 && decor[j][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundMore(player.x), y: getRoundMore2(player.y + dx) });
      } else if (player.x % 32 >= 32 - 10 && decor[j][i + 1] === "grass.png") {
        setPlayer({ ...player, x: getRoundLess(player.x), y: getRoundMore2(player.y + dx) });
      }
    }
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
  }

  return (
    <div onKeyDown={handleKeyDown} className="game" tabIndex="0">
      {decor.map((row, i) => (
        <div key={i}>
          {row.map((column, j) => (
            <Sprite key={j} x={j * 32} y={i * 32} image={column} />
          ))}
        </div>
      ))}
      <Sprite x={player.x} y={player.y} image="player.png" />
    </div>
  );
}
