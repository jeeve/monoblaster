import * as init from "./init";

export function getIndex(i, j) {
  return j * init.ni + i;
}

export function getI(n) {
  return n % init.ni;
}

export function getJ(n) {
  return Math.floor(n / init.ni);
}

export function blockAt(decor, i, j) {
  const n = getIndex(i, j);
  return !(decor[n].image === "");
}

export function emptyRandomPosition(decor) {
  const maxNumberTest = 1000;
  let numberTest = 0;
  while (numberTest < maxNumberTest) {
    const i = Math.floor(Math.random() * init.ni);
    const j = Math.floor(Math.random() * init.nj);
    if (!blockAt(decor, i, j)) {
      return { x: i, y: j };
    }
    numberTest++;
  }
  return { x: -1, y: -1 };
}

export function spriteLeft(n) {
  return n - 1;
}

export function spriteRight(n) {
  return n + 1;
}

export function spriteUp(n) {
  return n - init.ni;
}

export function spriteDown(n) {
  return n + init.ni;
}
