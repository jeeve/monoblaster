import * as Init from "./Init";
import * as Util from "./Util";

export function tryToGoLeft(decor, players, player, setPlayer) {
  function getSpritesArroundPlayer() {
    let objects = [];
    const i = Math.floor(player.x / 32);
    const j = Math.floor(player.y / 32);
    let sprite = decor[Util.getIndex(i - 1, j - 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[Util.getIndex(i - 1, j)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[Util.getIndex(i - 1, j + 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
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

  function objectAtUp(objects, o) {
    return objects.filter((object) => {
      if (object.x + 32 >= o.x + 32 - Init.dx && object.x + 32 <= o.x + 32) {
        if (object.y + 32 <= o.y && object.y + 32 > o.y - 32) {
          return true;
        }
      }
      return false;
    }).length != 0;
  }

    function objectAtDown(objects, o) {
    return objects.filter((object) => {
      if (object.x + 32 >= o.x + 32 - Init.dx && object.x + 32 <= o.x + 32) {
        if (object.y >= o.y + 32 && object.y < o.y + 64) {
          return true;
        }
      }
      return false;
    }).length != 0;
  }

  let ok = true;
  let x = player.x;
  let y = player.y;
  const objects = getBlocksNear();
  objects.forEach((object) => {
    if (
      (object.y + 32 > player.y && object.y + 32 < player.y + 32) ||
      (object.y < player.y + 32 && object.y > player.y) ||
      object.y === player.y
    ) {
      ok = false;
      x = object.x + 32;
    }
    if (object.y < player.y + 32 && object.y > player.y + 32 - Init.tolx) {
      ok = false;
      if (!objectAtUp(objects, object)) {
        ok = true;
        y = object.y - 32;
      }
    }
    if (object.y + 32 > player.y && object.y + 32 < player.y + Init.tolx) {
      ok = false;
      if (!objectAtDown(objects, object)) {
        ok = true;
        y = object.y + 32;
      }
    }
  });
  if (ok) {
    setPlayer({ ...player, x: player.x - Init.dx, y: y });
  } else {
    setPlayer({ ...player, x: x });
  }
}

export function tryToGoRight(decor, players, player, setPlayer) {
  function getSpritesArroundPlayer() {
    let objects = [];
    const i = Math.floor(player.x / 32);
    const j = Math.floor(player.y / 32);
    let sprite = decor[Util.getIndex(i + 1, j - 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[Util.getIndex(i + 1, j)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[Util.getIndex(i + 1, j + 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    players.map((p) => {
      if (p !== player) {
        objects.push({ x: p.x, y: p.y });
      }
    });
    return objects;
  }

  function getBlocksNear() {
    return getSpritesArroundPlayer().filter((object) => {
      return object.x > player.x + 32 - Init.dx && object.x <= player.x + 32;
    });
  }

  function objectAtUp(objects, o) {
    return objects.filter((object) => {
      if (object.x < o.x + Init.dx && object.x >= o.x) {
        if (object.y + 32 <= o.y && object.y + 32 > o.y - 32) {
          return true;
        }
      }
      return false;
    }).length != 0;
  }

    function objectAtDown(objects, o) {
    return objects.filter((object) => {
      if (object.x < o.x + Init.dx && object.x >= o.x) {
        if (object.y >= o.y + 32 && object.y < o.y + 64) {
          return true;
        }
      }
      return false;
    }).length != 0;
  }

  let ok = true;
  let x = player.x;
  let y = player.y;
  const objects = getBlocksNear();
  objects.forEach((object) => {
    if (
      (object.y + 32 > player.y && object.y + 32 < player.y + 32) ||
      (object.y < player.y + 32 && object.y > player.y) ||
      object.y === player.y
    ) {
      ok = false;
      x = object.x - 32;
    }
    if (object.y < player.y + 32 && object.y > player.y + 32 - Init.tolx) {
      ok = false;
      if (!objectAtUp(objects, object)) {
        ok = true;
        y = object.y - 32;
      }
    }
    if (object.y + 32 > player.y && object.y + 32 < player.y + Init.tolx) {
      ok = false;
      if (!objectAtDown(objects, object)) {
        ok = true;
        y = object.y + 32;
      }
    }
  });
  if (ok) {
    setPlayer({ ...player, x: player.x + Init.dx, y: y });
  } else {
    setPlayer({ ...player, x: x });
  }
}

export function tryToGoUp(decor, players, player, setPlayer) {
  function getSpritesArroundPlayer() {
    let objects = [];
    const i = Math.floor(player.x / 32);
    const j = Math.floor(player.y / 32);
    let sprite = decor[Util.getIndex(i - 1, j - 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[Util.getIndex(i, j - 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[Util.getIndex(i + 1, j - 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    players.map((p) => {
      if (p !== player) {
        objects.push({ x: p.x, y: p.y });
      }
    });
    return objects;
  }

  function getBlocksNear() {
    return getSpritesArroundPlayer().filter((object) => {
      return object.y + 32 > player.y - Init.dx && object.y + 32 <= player.y;
    });
  }

  function objectAtLeft(objects, o) {
    return objects.filter((object) => {
      if (object.y + 32 >= o.y + 32 - Init.dx && object.y + 32 <= o.y + 32) {
        if (object.x + 32 <= o.x && object.x + 32 > o.x - 32) {
          return true;
        }
      }
      return false;
    }).length != 0;
  }

    function objectAtRight(objects, o) {
    return objects.filter((object) => {
      if (object.x + 32 >= o.x + 32 - Init.dx && object.x + 32 <= o.x + 32) {
        if (object.y >= o.y + 32 && object.y < o.y + 64) {
          return true;
        }
      }
      return false;
    }).length != 0;
  }

  let ok = true;
  let x = player.x;
  let y = player.y;
  const objects = getBlocksNear();
  objects.forEach((object) => {
    if (
      (object.x + 32 > player.x && object.x + 32 < player.x + 32) ||
      (object.x < player.x + 32 && object.x > player.x) ||
      object.x === player.x
    ) {
      ok = false;
      y = object.y + 32;
    }
    if (object.x < player.x + 32 && object.x > player.x + 32 - Init.tolx) {
      ok = false;
      if (!objectAtLeft(objects, object)) {
        ok = true;
        x = object.x - 32;
      }
    }
    if (object.x + 32 > player.x && object.x + 32 < player.x + Init.tolx) {
      ok = false;
      if (!objectAtRight(objects, object)) {
        ok = true;
        x = object.x + 32;
      }
    }
  });
  if (ok) {
    setPlayer({ ...player, x: x, y: player.y - Init.dx });
  } else {
    setPlayer({ ...player, y: y });
  }

}

export function tryToGoDown(decor, players, player, setPlayer) {
  setPlayer({ ...player, y: player.y + Init.dx });
}
