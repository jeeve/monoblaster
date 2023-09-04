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

export function blockAt(decor, i, j) {
  const n = getIndex(i, j);
  return !(decor[n].image === "");
}

export function playerAt(players, player, x, y) {
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    if ((player.x !== p.x || player.y !== p.y) && (Math.abs(p.x - x) < 32 && Math.abs(p.y - y) < 32)) {
      return p;
    }
  }
  return null;
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

export function something(decor, players, player, n) {
  const i = getI(n);
  const j = getJ(n);
  if (decor[n].image !== "") {
    return true;
  }
  if (playerAt(players, player, i*32, j*32) != null) {
    return true;
  }
  return false;
}

export function danger(n, decor, fires) {
  return decor[n].image.includes("bomb") || fires.includes(n);
}

export function spriteLeft(n) {
  return n - 1;
}

export function spriteRight(n) {
  return n + 1;
}

export function spriteUp(n) {
  return n - Init.ni;
}

export function spriteDown(n) {
  return n + Init.ni;
}
