import { useState } from 'react';

function Sprite( {x, y } ) {

  const style = {
    left : x,
    top : y
  };

  return (
    <img style={style} src="player.png" />
  );
}

export default function Jeu() {

  const [x, setX] = useState(150);
  const [y, setY] = useState(100);

  function handleKeyDown(event) {
    if (event.code == "ArrowLeft") {
      setX(x - 5)
    }
    if (event.code == "ArrowRight") {
      setX(x + 5)
    }
    if (event.code == "ArrowDown") {
      setY(y + 5)
    }
    if (event.code == "ArrowUp") {
      setY(y - 5)
    }
  }

  return (
    <>
      <div onKeyDown={handleKeyDown} className='jeu' tabIndex="0" >
        <Sprite x={x} y={y} />
      </div>  
    </>
  );
}
