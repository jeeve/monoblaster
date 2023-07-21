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

  useEffect(() => {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const columns = [];
      for (let j = 0; j < 15; j++) {
        if (i === 0 || i === 9 || j === 0 || j === 14) {
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

  function blockAt(x, y) {
    const i = Math.floor(x / 32);
    const j = Math.floor(y / 32);
    return decor[j][i];
  }

  function getRoundLess(x) {
    return x + 32 - (x % 32);
  }

  function getRoundLess2(x) {
    if (x % 32 <= 5) {
      return 32 * Math.floor(x / 32);
    }
    return x;      
  }

  function getRoundMore2(x) {
    if (x % 32 >= 32 - 5) {
      return x + 32 - (x % 32);
    }
    return x;      
  }

  function getRoundMore(x) {
    return 32 * Math.floor(x / 32);
  }

  function tryToGoLeft() {
    if (player.y % 32 == 0) {
      if (blockAt(player.x - 5, player.y) === "grass.png") {
        setPlayer({ ...player, x: player.x - 5 });
      } else {
        setPlayer({ ...player, x: getRoundLess(player.x - 5) });
      }
    } else {
      if (player.y % 32 <= 5) {
        if (blockAt(player.x - 5, player.y) === "grass.png") {
          setPlayer({ ...player, x: player.x - 5, y: getRoundMore(player.y) });
        }
      }
      if (32 - (player.y % 32) <= 5) {
        if (blockAt(player.x - 5, player.y + 32) === "grass.png") {
          setPlayer({ ...player, x: player.x - 5, y: getRoundLess(player.y) });
        }
      }
    }
  }

  function tryToGoRight() {
    if (player.y % 32 == 0) {
      if (blockAt(player.x + 32 + 5, player.y) === "grass.png") {
        setPlayer({ ...player, x: player.x + 5 });
      } else {
        setPlayer({ ...player, x: getRoundMore(player.x + 5) });
      }
    } else {
      if (player.y % 32 <= 5) {
        if (blockAt(player.x + 32 + 5, player.y) === "grass.png") {
          setPlayer({ ...player, x: player.x + 5, y: getRoundMore(player.y) });
        }
      }
      if (32 - (player.y % 32) <= 5) {
        if (blockAt(player.x + 32 + 5, player.y + 32) === "grass.png") {
          setPlayer({ ...player, x: player.x + 5, y: getRoundLess(player.y) });
        }
      }
    }
  }

  function tryToGoUp() {
    const i = Math.floor(player.x / 32);
    let j = Math.floor((player.y - 5) / 32);
    if (player.x % 32 == 0) {
      if (decor[j][i] === "grass.png") {
        setPlayer({ ...player, y: getRoundLess2(player.y - 5) });
      }
    } else {
      if (decor[j][i] === "grass.png" && decor[j][i + 1] === "grass.png") {
        setPlayer({ ...player, y: getRoundLess2(player.y - 5) });
      } else if (player.x % 32 <= 5 && decor[j][i] === "grass.png") {
        setPlayer({ ...player, x: getRoundMore(player.x), y: getRoundLess2(player.y - 5) });
      } else if (player.x % 32 >= 32 - 5 && decor[j][i + 1] === "grass.png") {
        setPlayer({ ...player, x: getRoundLess(player.x), y: getRoundLess2(player.y - 5) });
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
      if (blockAt(player.x, player.y + 32 + 5) === "grass.png") {
        setPlayer({ ...player, y: player.y + 5 });
      } else {
        setPlayer({ ...player, y: getRoundMore(player.y + 5) });
      }
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
