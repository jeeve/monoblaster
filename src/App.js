import { useEffect, useState } from "react";

function Sprite({ x, y, image }) {
  const style = {
    left: x,
    top: y,
  };

  return <img style={ style } src={ image } />;
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
          columns.push("brick.png");
        } else {
          columns.push("grass.png");
        }
      }
      rows.push(columns);
    }
    setDecor(rows);
  }, []);

  function hasBlockAt(x, y) {
    const i = Math.floor(x / 32);
    const j = Math.floor(y / 32);              
    return decor[j][i] !== "grass.png";
  }

  function getXArrondiMoins(x) {
    return x + 32 - x % 32;
  }

  function getXArrondiPlus(x) {
    return 32*Math.floor(x / 32);
  }

  function handleKeyDown(event) {
    if (event.code === "ArrowLeft") {
      if (!hasBlockAt(player.x - 5, player.y)) {
        setPlayer({ ...player, x: player.x - 5 });
      } else {
        setPlayer({ ...player, x: getXArrondiMoins(player.x - 5) });
      }
    }
    if (event.code === "ArrowRight") {
      if (!hasBlockAt(player.x + 32 + 5, player.y)) {
        setPlayer({ ...player, x: player.x + 5 });
      } else {
        setPlayer({ ...player, x: getXArrondiPlus(player.x + 5) });
      }
    }
    if (event.code === "ArrowDown") {
      if (!hasBlockAt(player.x, player.y + 32 + 5)) {
        setPlayer({ ...player, y: player.y + 5 });
      } else {
        setPlayer({ ...player, y: getXArrondiPlus(player.y + 5) });
      }
    }
    if (event.code === "ArrowUp") {
      if (!hasBlockAt(player.x, player.y - 5)) {
        setPlayer({ ...player, y: player.y - 5 });
      } else {
        setPlayer({ ...player, y: getXArrondiMoins(player.y - 5) });
      }
    }
  }

  return (
    <div onKeyDown={ handleKeyDown } className="game" tabIndex="0">
      { decor.map((row, i) => (
        <div key={ i }>
          { row.map((column, j) => (
            <Sprite key= {j } x={ j * 32 } y={ i * 32 } image={ column } />
          )) }
        </div>
      )) }
      <Sprite x={ player.x } y={ player.y } image="player.png" />
    </div>
  );
}
