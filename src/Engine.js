import * as Init from "./Init";
import * as Util from "./Util";

export function tryToGoLeft(decor, players, player, setPlayer) {
  function goIfNoPlayer(x, y) {
    if (!Util.playerAt(players, player, x, y)) {
      setPlayer({ ...player, x: x, y: y });
    } else {
      if (player.y % 32 <= Init.tolx && !Util.playerAt(players, player, x, y - 32)  && !Util.playerAt(players, player, x, Util.getRoundMore(y))) {
        setPlayer({ ...player, x: x, y: Util.getRoundMore(y) });
      } else {
        if (player.y % 32 >= 32 - Init.tolx && !Util.playerAt(players, player, x, y + 32) && !Util.playerAt(players, player, x, Util.getRoundLess(y))) {
          setPlayer({ ...player, x: x, y: Util.getRoundLess(y) });
        }
      }
    }
  }

  const i = Math.floor((player.x - Init.dx) / 32);
  const j = Math.floor(player.y / 32);
  if (player.y % 32 === 0) {
    if (!Util.blockAt(decor, i, j)) {
      goIfNoPlayer(Util.getRoundLessToBlock(player.x - Init.dx), player.y);
    }
  } else {
    if (!Util.blockAt(decor, i, j) && !Util.blockAt(decor, i, j + 1)) {
      goIfNoPlayer(Util.getRoundLessToBlock(player.x - Init.dx), player.y);
    } else if (player.y % 32 <= Init.tolx && !Util.blockAt(decor, i, j)) {
      goIfNoPlayer(
        Util.getRoundLessToBlock(player.x - Init.dx),
        Util.getRoundMore(player.y)
      );
    } else if (
      player.y % 32 >= 32 - Init.tolx &&
      !Util.blockAt(decor, i, j + 1)
    ) {
      goIfNoPlayer(
        Util.getRoundLessToBlock(player.x - Init.dx),
        Util.getRoundLess(player.y)
      );
    }
  }
}

export function tryToGoRight(decor, players, player, setPlayer) {
  const i = Math.floor((player.x + 32 + Init.dx) / 32);
  const j = Math.floor(player.y / 32);
  if (player.y % 32 === 0) {
    if (!Util.blockAt(decor, i, j)) {
      setPlayer({ ...player, x: Util.getRoundMoreToBlock(player.x + Init.dx) });
    }
  } else {
    if (!Util.blockAt(decor, i, j) && !Util.blockAt(decor, i, j + 1)) {
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

export function tryToGoUp(decor, players, player, setPlayer) {
  const i = Math.floor(player.x / 32);
  const j = Math.floor((player.y - Init.dx) / 32);
  if (player.x % 32 === 0) {
    if (!Util.blockAt(decor, i, j)) {
      setPlayer({ ...player, y: Util.getRoundLessToBlock(player.y - Init.dx) });
    }
  } else {
    if (!Util.blockAt(decor, i, j) && !Util.blockAt(decor, i + 1, j)) {
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

export function tryToGoDown(decor, players, player, setPlayer) {
  const i = Math.floor(player.x / 32);
  const j = Math.floor((player.y + 32 + Init.dx) / 32);
  if (player.x % 32 === 0) {
    if (!Util.blockAt(decor, i, j)) {
      setPlayer({ ...player, y: Util.getRoundMoreToBlock(player.y + Init.dx) });
    }
  } else {
    if (!Util.blockAt(decor, i, j) && !Util.blockAt(decor, i + 1, j)) {
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
