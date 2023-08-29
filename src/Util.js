import * as Init from "./Init";

export function getIndex(i, j) {
  return j * Init.ni + i;
}

export function getI(n) {
  return n % Init.ni;
}

export function getJ(n) {
  return Math.floor(n / Init.ni);
}

export function getRoundLess(x) {
  return x + 32 - (x % 32);
}

export function getRoundLessToBlock(x) {
  if (x % 32 <= Init.dx) {
    return getRoundMore(x);
  }
  return x;
}

export function getRoundMore(x) {
  return 32 * Math.floor(x / 32);
}

export function getRoundMoreToBlock(x) {
  if (x % 32 >= 32 - Init.dx) {
    return getRoundLess(x);
  }
  return x;
}

export function blockAt(decor, i, j) {
  const n = getIndex(i, j);
  return !(decor[n].image === "");
}

export function playerAt(players, player, x, y) {
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    if ((player.x !== p.x || player.y !== p.y) && (Math.abs(p.x - x) < 32 && Math.abs(p.y - y) < 32)) {
      return true;
    }
  }
  return false;
}

export function emptyRandomPosition(decor) {
  const maxNumberTest = 1000;
  let numberTest = 0;
  while (numberTest < maxNumberTest) {
    const i = Math.floor(Math.random() * Init.ni);
    const j = Math.floor(Math.random() * Init.nj);
    if (!blockAt(decor, i, j)) {
      return { x: i, y: j };
    }
    numberTest++;
  }
  return { x: -1, y: -1 };
}
