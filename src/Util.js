import * as Init from "./Init"

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

export function emptyRandomPosition(decor, exceptI, exceptJ) {
  const maxNumberTest = 1000;
  let numberTest = 0;
  while (numberTest < maxNumberTest) {
    const i = Math.floor(Math.random() * Init.ni);
    const j = Math.floor(Math.random() * Init.nj);
    if ((exceptI < 0 && !blockAt(decor, i, j)) || (exceptI > -1 && !blockAt(decor, i, j) && !blockAt(decor, exceptI, exceptJ))) {
      return { x: i, y: j };
    }
    numberTest++;
  }
  return { x: -1, y: -1 };
}