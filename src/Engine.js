import * as Init from "./Init";
import * as Util from "./Util";

export function tryToGoLeft(decor, players, player, setPlayer) {
  function getSpritesArroundPlayer() {
    let objects = [];
    const i = Math.floor(player.x / 32);
    const j = Math.floor(player.y / 32);
    let sprite = decor[Util.getIndex(i - 1, j - 1)];
    if (sprite.image !== "")
      objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[Util.getIndex(i - 1, j)];
    if (sprite.image !== "")
      objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[Util.getIndex(i - 1, j + 1)];
    if (sprite.image !== "")
      objects.push({ x: sprite.x, y: sprite.y });
    players.map((p) => {
      if (p !== player) {
        objects.push({ x: p.x, y: p.y });
      }
    });
    return objects;
  }

  function getBlocksNear() {
    return getSpritesArroundPlayer().filter((object) => {
      return object.x + 32 > player.x - Init.dx && object.x + 32 <= player.x;
    });
  }

  let ok = true;
  let deltax = 0;
  let y = player.y;
  getBlocksNear().forEach((object) => {
    if (
      (object.y + 32 > player.y && object.y + 32 < player.y + 32) ||
      (object.y < player.y + 32 && object.y > player.y) ||
      object.y === player.y
    ) {
      ok = false;
      deltax = player.x - (object.x + 32);
    }
    if (object.y + 32 > player.y && object.y + 32 < player.y + Init.tolx) {
      ok = true;
      y = object.y + 32;
    }
    if (object.y < player.y + 32 && object.y > player.y + 32 - Init.tolx) {
      ok = true;
      y = object.y - 32;
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
