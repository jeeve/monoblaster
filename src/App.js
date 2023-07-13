import { useEffect, useState } from 'react';

function Sprite( {x, y, image } ) {

  const style = {
    left : x,
    top : y
  };

  return (
    <img style={style} src={image} />
  );
}

export default function Game() {

  const [decor, setDecor] = useState([]);
  const [player, setPlayer] = useState({ x: 150, y: 100 });

  useEffect(() => {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const columns = [];
      for (let j = 0; j < 15; j++) {
        if (i == 0 || i == 9 || j == 0 || j == 14) {
          columns.push('brick.png');
        } else {
          columns.push('grass.png');
        }
      }
      rows.push(columns);
    }
    setDecor(rows);
  }, []);

  function handleKeyDown(event) {
    if (event.code === "ArrowLeft") {
      setPlayer({...player, 'x': player.x - 5});
    }
    if (event.code === "ArrowRight") {
      setPlayer({...player, 'x': player.x + 5});
    }
    if (event.code === "ArrowDown") {
      setPlayer({...player, 'y': player.y + 5});
    }
    if (event.code === "ArrowUp") {
      setPlayer({...player, 'y': player.y - 5});
    }
  }

  return (
      <div onKeyDown={ handleKeyDown } className='game' tabIndex="0" >
        { decor.map((row, i) => 
          <div key={i} >
            { row.map((column, j) =>
              <Sprite key={ j } x={ j * 32 } y={ i * 32 } image={ column } />
            )} 
          </div> 
        )}
        <Sprite x={ player.x } y={ player.y } image='player.png' />
      </div>  
  );
}
