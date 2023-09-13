import * as init from "./init";
import * as util from "./util";

export function tryToGoLeft(decor, players, player, setPlayers) {
  function getSpritesArroundPlayer() {
    let objects = [];
    const i = Math.floor(player.x / 32);
    const j = Math.floor(player.y / 32);
    let sprite = decor[util.getIndex(i - 1, j - 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[util.getIndex(i - 1, j)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[util.getIndex(i - 1, j + 1)];
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
      return object.x + 32 > player.x - init.dx && object.x + 32 <= player.x;
    });
  }

  function objectAtUp(objects, o) {
    return (
      objects.filter((object) => {
        if (object.y + 32 <= o.y && object.y + 32 > o.y - 32) {
          return true;
        }
        return false;
      }).length !== 0
    );
  }

  function objectAtDown(objects, o) {
    return (
      objects.filter((object) => {
        if (object.y >= o.y + 32 && object.y < o.y + 64) {
          return true;
        }
        return false;
      }).length !== 0
    );
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
    if (object.y < player.y + 32 && object.y > player.y + 32 - init.tolx) {
      ok = false;
      if (!objectAtUp(objects, object)) {
        ok = true;
        y = object.y - 32;
      }
    }
    if (object.y + 32 > player.y && object.y + 32 < player.y + init.tolx) {
      ok = false;
      if (!objectAtDown(objects, object)) {
        ok = true;
        y = object.y + 32;
      }
    }
  });
  if (ok) {
    x = player.x - init.dx;
  }
  const newPlayers = Object.assign([], players);
  newPlayers[player.n].x = x;
  newPlayers[player.n].y = y;
  setPlayers(newPlayers);
}

export function tryToGoRight(decor, players, player, setPlayers) {
  function getSpritesArroundPlayer() {
    let objects = [];
    const i = Math.floor(player.x / 32);
    const j = Math.floor(player.y / 32);
    let sprite = decor[util.getIndex(i + 1, j - 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[util.getIndex(i + 1, j)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[util.getIndex(i + 1, j + 1)];
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
      return object.x > player.x + 32 - init.dx && object.x <= player.x + 32;
    });
  }

  function objectAtUp(objects, o) {
    return (
      objects.filter((object) => {
        if (object.y + 32 <= o.y && object.y + 32 > o.y - 32) {
          return true;
        }
        return false;
      }).length !== 0
    );
  }

  function objectAtDown(objects, o) {
    return (
      objects.filter((object) => {
        if (object.y >= o.y + 32 && object.y < o.y + 64) {
          return true;
        }
        return false;
      }).length !== 0
    );
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
    if (object.y < player.y + 32 && object.y > player.y + 32 - init.tolx) {
      ok = false;
      if (!objectAtUp(objects, object)) {
        ok = true;
        y = object.y - 32;
      }
    }
    if (object.y + 32 > player.y && object.y + 32 < player.y + init.tolx) {
      ok = false;
      if (!objectAtDown(objects, object)) {
        ok = true;
        y = object.y + 32;
      }
    }
  });
  if (ok) {
    x = player.x + init.dx;
  }
  const newPlayers = Object.assign([], players);
  newPlayers[player.n].x = x;
  newPlayers[player.n].y = y;
  setPlayers(newPlayers);
}

export function tryToGoUp(decor, players, player, setPlayers) {
  function getSpritesArroundPlayer() {
    let objects = [];
    const i = Math.floor(player.x / 32);
    const j = Math.floor(player.y / 32);
    let sprite = decor[util.getIndex(i - 1, j - 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[util.getIndex(i, j - 1)];
    if (sprite.image !== "") objects.push({ x: sprite.x, y: sprite.y });
    sprite = decor[util.getIndex(i + 1, j - 1)];
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
      return object.y + 32 > player.y - init.dx && object.y + 32 <= player.y;
    });
  }

  function objectAtLeft(objects, o) {
    return (
      objects.filter((object) => {
        if (object.x + 32 <= o.x && object.x + 32 > o.x - 32) {
          return true;
        }
        return false;
      }).length !== 0
    );
  }

  function objectAtRight(objects, o) {
    return (
      objects.filter((object) => {
        if (object.x >= o.x + 32 && object.x < o.x + 64) {
          return true;
        }
        return false;
      }).length !== 0
    );
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
    if (object.x < player.x + 32 && object.x > player.x + 32 - init.tolx) {
      ok = false;
      if (!objectAtLeft(objects, object)) {
        ok = true;
        x = object.x - 32;
      }
    }
    if (object.x + 32 > player.x && object.x + 32 < player.x + init.tolx) {
      ok = false;
      if (!objectAtRight(objects, object)) {
        ok = true;
        x = object.x + 32;
      }
    }
  });
  if (ok) {
    y = player.y - init.dx;
  }
  const newPlayers = Object.assign([], players);
  newPlayers[player.n].x = x;
  newPlayers[player.n].y = y;
  setPlayers(newPlayers);
}

export function tryToGoDown(decor, players, player, setPlayers) {

  function isInZonePlayer(sprite) {
    return sprite.x <= player.x + 64 && sprite.x >= player.x - 32 && sprite.y >= player.y + 32 && sprite.y <= player.y + 32 + init.dx;
  }

  function getObjectsArroundPlayer() {
    const objects = decor.filter((sprite) => {
      return sprite.image !== "" && isInZonePlayer(sprite);
    });
    players.map((p) => {
      if (p !== player) {
        if (isInZonePlayer(p)) {
          objects.push(p);
        }
      }
    });
    return objects;
  }

  const objects = getObjectsArroundPlayer();
  let ok = objects.filter((o) => {
    return o.x + 32 > player.x && o.x < player.x + 32
  }).length === 0; 

  let x = player.x;
  let y = player.y;
  if (ok) {
    y = player.y + init.dx;
  }
  const newPlayers = Object.assign([], players);
  newPlayers[player.n].x = x;
  newPlayers[player.n].y = y;
  setPlayers(newPlayers);
}
