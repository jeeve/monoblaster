import * as Init from "./Init"
import * as Util from "./Util"

export function tryToGoLeft(decor, players, player, setPlayer) {
    const i = Math.floor((player.x - Init.dx) / 32);
    const j = Math.floor(player.y / 32);
    const o1 = Util.blockOrPlayerAt(decor, players, player, i, j - 1);
    const o2 = Util.blockOrPlayerAt(decor, players, player, i, j);

    if (o1 === null && o2 === null) {
      setPlayer({ ...player, x: player.x - Init.dx });
    } else if (o1 === null && o2 !== null) {
      const deltax = Init.dx;
      if (player.x - o2.x + 32 > Init.dx) {
        deltax = 
      }

    }

  




    if (player.y % 32 === 0) {
      const o = Util.blockOrPlayerAt(decor, players, player, i, j);
      if (o == null) {
        setPlayer({ ...player, x: o.x + 32 });
      }
    } else {
      const o1 = Util.blockOrPlayerAt(decor, players, player, i, j);
      const o2 = Util.blockOrPlayerAt(decor, players, player, i, j + 1);  
      if (o1 == null && o2 == null) {
        setPlayer({ ...player, x: o.x + 32 });
      } else if (player.y % 32 <= Init.tolx && o1 == null) {
        setPlayer({
          ...player,
          y: Util.getRoundMore(player.y),
          x: Util.getRoundLessToBlock(player.x - Init.dx),
        });
      } else if (
        player.y % 32 >= 32 - Init.tolx &&
        !Util.blockOrPlayerAt(decor, players, player, i, j + 1)
      ) {
        setPlayer({
          ...player,
          y: Util.getRoundLess(player.y),
          x: Util.getRoundLessToBlock(player.x - Init.dx),
        });
      }
    }
  }

  export function tryToGoRight(decor, players, player, setPlayer) {
    const i = Math.floor((player.x + 32 + Init.dx) / 32);
    const j = Math.floor(player.y / 32);
    if (player.y % 32 === 0) {
      if (!Util.blockOrPlayerAt(decor, players, player, i, j)) {
        setPlayer({ ...player, x: Util.getRoundMoreToBlock(player.x + Init.dx) });
      }
    } else {
      if (
        !Util.blockOrPlayerAt(decor, players, player, i, j) &&
        !Util.blockOrPlayerAt(decor, players, player, i, j + 1)
      ) {
        setPlayer({ ...player, x: Util.getRoundMoreToBlock(player.x + Init.dx) });
      } else if (player.y % 32 <= Init.tolx && !Util.blockOrPlayerAt(decor, players, player, i, j)) {
        setPlayer({
          ...player,
          y: Util.getRoundMore(player.y),
          x: Util.getRoundMoreToBlock(player.x + Init.dx),
        });
      } else if (
        player.y % 32 >= 32 - Init.tolx &&
        !Util.blockOrPlayerAt(decor, players, player, i, j + 1)
      ) {
        setPlayer({
          ...player,
          y: Util.getRoundLess(player.y),
          x: Util.getRoundMoreToBlock(player.x + Init.dx),
        });
      }
    }
  }

  export function tryToGoUp(decor, players, player, setPlayer) {
    const i = Math.floor(player.x / 32);
    const j = Math.floor((player.y - Init.dx) / 32);
    if (player.x % 32 === 0) {
      if (!Util.blockOrPlayerAt(decor, players, player, i, j)) {
        setPlayer({ ...player, y: Util.getRoundLessToBlock(player.y - Init.dx) });
      }
    } else {
      if (
        !Util.blockOrPlayerAt(decor, players, player, i, j) &&
        !Util.blockOrPlayerAt(decor, players, player, i + 1, j)
      ) {
        setPlayer({ ...player, y: Util.getRoundLessToBlock(player.y - Init.dx) });
      } else if (player.x % 32 <= Init.tolx && !Util.blockOrPlayerAt(decor, players, player, i, j)) {
        setPlayer({
          ...player,
          x: Util.getRoundMore(player.x),
          y: Util.getRoundLessToBlock(player.y - Init.dx),
        });
      } else if (
        player.x % 32 >= 32 - Init.tolx &&
        !Util.blockOrPlayerAt(decor, players, player, i + 1, j)
      ) {
        setPlayer({
          ...player,
          x: Util.getRoundLess(player.x),
          y: Util.getRoundLessToBlock(player.y - Init.dx),
        });
      }
    }
  }

  export function tryToGoDown(decor, players, player, setPlayer) {
    const i = Math.floor(player.x / 32);
    const j = Math.floor((player.y + 32 + Init.dx) / 32);
    if (player.x % 32 === 0) {
      if (!Util.blockOrPlayerAt(decor, players, player, i, j)) {
        setPlayer({ ...player, y: Util.getRoundMoreToBlock(player.y + Init.dx) });
      }
    } else {
      if (
        !Util.blockOrPlayerAt(decor, players, player, i, j) &&
        !Util.blockOrPlayerAt(decor, players, player, i + 1, j)
      ) {
        setPlayer({ ...player, y: Util.getRoundMoreToBlock(player.y + Init.dx) });
      } else if (player.x % 32 <= Init.tolx && !Util.blockOrPlayerAt(decor, players, player, i, j)) {
        setPlayer({
          ...player,
          x: Util.getRoundMore(player.x),
          y: Util.getRoundMoreToBlock(player.y + Init.dx),
        });
      } else if (
        player.x % 32 >= 32 - Init.tolx &&
        !Util.blockOrPlayerAt(decor, players, player, i + 1, j)
      ) {
        setPlayer({
          ...player,
          x: Util.getRoundLess(player.x),
          y: Util.getRoundMoreToBlock(player.y + Init.dx),
        });
      }
    }
  }