import * as Init from "./Init"
import * as Util from "./Util"

export function tryToGoLeft(decor, player, setPlayer) {
    const i = Math.floor((player.x - Init.dx) / 32);
    const j = Math.floor(player.y / 32);
    if (player.y % 32 === 0) {
      if (!Util.blockAt(decor, i, j)) {
        setPlayer({ ...player, x: Util.getRoundLessToBlock(player.x - Init.dx) });
      }
    } else {
      if (
        !Util.blockAt(decor, i, j) &&
        !Util.blockAt(decor, i, j + 1)
      ) {
        setPlayer({ ...player, x: Util.getRoundLessToBlock(player.x - Init.dx) });
      } else if (player.y % 32 <= Init.tolx && !Util.blockAt(decor, i, j)) {
        setPlayer({
          ...player,
          y: Util.getRoundMore(player.y),
          x: Util.getRoundLessToBlock(player.x - Init.dx),
        });
      } else if (
        player.y % 32 >= 32 - Init.tolx &&
        !Util.blockAt(decor, i, j + 1)
      ) {
        setPlayer({
          ...player,
          y: Util.getRoundLess(player.y),
          x: Util.getRoundLessToBlock(player.x - Init.dx),
        });
      }
    }
  }

  export function tryToGoRight(decor, player, setPlayer) {
    const i = Math.floor((player.x + 32 + Init.dx) / 32);
    const j = Math.floor(player.y / 32);
    if (player.y % 32 === 0) {
      if (!Util.blockAt(decor, i, j)) {
        setPlayer({ ...player, x: Util.getRoundMoreToBlock(player.x + Init.dx) });
      }
    } else {
      if (
        !Util.blockAt(decor, i, j) &&
        !Util.blockAt(decor, i, j + 1)
      ) {
        setPlayer({ ...player, x: Util.getRoundMoreToBlock(player.x + Init.dx) });
      } else if (player.y % 32 <= Init.tolx && !Util.blockAt(decor, i, j)) {
        setPlayer({
          ...player,
          y: Util.getRoundMore(player.y),
          x: Util.getRoundMoreToBlock(player.x + Init.dx),
        });
      } else if (
        player.y % 32 >= 32 - Init.tolx &&
        !Util.blockAt(decor, i, j + 1)
      ) {
        setPlayer({
          ...player,
          y: Util.getRoundLess(player.y),
          x: Util.getRoundMoreToBlock(player.x + Init.dx),
        });
      }
    }
  }

  export function tryToGoUp(decor, player, setPlayer) {
    const i = Math.floor(player.x / 32);
    const j = Math.floor((player.y - Init.dx) / 32);
    if (player.x % 32 === 0) {
      if (!Util.blockAt(decor, i, j)) {
        setPlayer({ ...player, y: Util.getRoundLessToBlock(player.y - Init.dx) });
      }
    } else {
      if (
        !Util.blockAt(decor, i, j) &&
        !Util.blockAt(decor, i + 1, j)
      ) {
        setPlayer({ ...player, y: Util.getRoundLessToBlock(player.y - Init.dx) });
      } else if (player.x % 32 <= Init.tolx && !Util.blockAt(decor, i, j)) {
        setPlayer({
          ...player,
          x: Util.getRoundMore(player.x),
          y: Util.getRoundLessToBlock(player.y - Init.dx),
        });
      } else if (
        player.x % 32 >= 32 - Init.tolx &&
        !Util.blockAt(decor, i + 1, j)
      ) {
        setPlayer({
          ...player,
          x: Util.getRoundLess(player.x),
          y: Util.getRoundLessToBlock(player.y - Init.dx),
        });
      }
    }
  }

  export function tryToGoDown(decor, player, setPlayer) {
    const i = Math.floor(player.x / 32);
    const j = Math.floor((player.y + 32 + Init.dx) / 32);
    if (player.x % 32 === 0) {
      if (!Util.blockAt(decor, i, j)) {
        setPlayer({ ...player, y: Util.getRoundMoreToBlock(player.y + Init.dx) });
      }
    } else {
      if (
        !Util.blockAt(decor, i, j) &&
        !Util.blockAt(decor, i + 1, j)
      ) {
        setPlayer({ ...player, y: Util.getRoundMoreToBlock(player.y + Init.dx) });
      } else if (player.x % 32 <= Init.tolx && !Util.blockAt(decor, i, j)) {
        setPlayer({
          ...player,
          x: Util.getRoundMore(player.x),
          y: Util.getRoundMoreToBlock(player.y + Init.dx),
        });
      } else if (
        player.x % 32 >= 32 - Init.tolx &&
        !Util.blockAt(decor, i + 1, j)
      ) {
        setPlayer({
          ...player,
          x: Util.getRoundLess(player.x),
          y: Util.getRoundMoreToBlock(player.y + Init.dx),
        });
      }
    }
  }