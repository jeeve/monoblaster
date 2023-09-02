import * as Init from "./Init";
import * as Util from "./Util";

export function tryToGoLeft(decor, players, player, setPlayer) {
  function getSpritesArroundPlayer() {
    const i = Math.floor(player.x / 32);
    const j = Math.floor(player.y / 32);
    return [
      Util.getIndex(i - 1, j - 1),
      Util.getIndex(i - 1, j),
      Util.getIndex(i - 1, j + 1),
    ];
  }

  function getBlocksNear() {
    return getSpritesArroundPlayer().filter((sprite) => {
      if (decor[sprite].image !== "") {
        return (
          decor[sprite].x + 32 > player.x - Init.dx &&
          decor[sprite].x + 32 <= player.x
        );
      }
      return false;
    });
  }

  let ok = true;
  let deltax = 0;
  let y = player.y;
  getBlocksNear().forEach((sprite) => {
    if (
      (decor[sprite].y + 32 > player.y &&
        decor[sprite].y + 32 < player.y + 32) ||
      (decor[sprite].y < player.y + 32 && decor[sprite].y > player.y) ||
      decor[sprite].y === player.y
    ) {
      ok = false;
      deltax = player.x - (decor[sprite].x + 32);
    }

    if (
      decor[sprite].y + 32 > player.y &&
      decor[sprite].y + 32 < player.y + Init.tolx
    ) {
      ok = true;
      y = decor[sprite].y + 32;
    }
    if (
      decor[sprite].y < player.y + 32 &&
      decor[sprite].y > player.y + 32 - Init.tolx
    ) {
      ok = true;
      y = decor[sprite].y - 32;
    }
  });
  if (ok) {
    setPlayer({ ...player, x: player.x - Init.dx, y: y });
  } else {
    setPlayer({ ...player, x: player.x - deltax });
  }
}

export function tryToGoRight(decor, players, player, setPlayer) {
  setPlayer({ ...player, x: player.x + Init.dx });
}

export function tryToGoUp(decor, players, player, setPlayer) {
  setPlayer({ ...player, y: player.y - Init.dx });
}

export function tryToGoDown(decor, players, player, setPlayer) {
  setPlayer({ ...player, y: player.y + Init.dx });
}
