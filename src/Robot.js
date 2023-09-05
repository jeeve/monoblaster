import * as init from "./init";
import * as util from "./util";
import * as engine from "./engine";

export function moveRobot(
  decor,
  robotInertia,
  setRobotInertia,
  players,
  robot,
  dropBomb,
  fires
) {
  function something(n) {
    const i = util.getI(n);
    const j = util.getJ(n);
    if (decor[n].image !== "") {
      return true;
    }
    if (
      players.filter(
        (p) => Math.abs(p.x - i * 32) < 16 && Math.abs(p.y - j * 32) < 16
      ).length > 0
    ) {
      return true;
    }
    if (fires.includes(n)) {
      return true;
    }
    return false;
  }

  function danger(n) {
    return decor[n].image.includes("bomb") || fires.includes(n);
  }

  const iRobot = Math.floor(robot().x / 32);
  const jRobot = Math.floor(robot().y / 32);
  const nRobot = util.getIndex(iRobot, jRobot);
  const t = Math.round(Math.random() * init.robotAgitation) + 2;
  if (
    danger(util.spriteLeft(nRobot)) ||
    danger(util.spriteRight(nRobot))
  ) {
    if (!something(util.spriteUp(nRobot))) {
      engine.tryToGoUp(decor, players, robot());
    } else {
      engine.tryToGoDown(decor, players, robot());
    }
  } else if (
    danger(util.spriteUp(nRobot)) ||
    danger(util.spriteDown(nRobot))
  ) {
    if (!something(util.spriteLeft(nRobot))) {
      engine.tryToGoLeft(decor, players, robot());
    } else {
      engine.tryToGoRight(decor, players, robot());
    }
  } else {
    if (robotInertia.t > 0) {
      if (robotInertia.d === "up") {
        engine.tryToGoUp(decor, players, robot());
      }
      if (robotInertia.d === "down") {
        engine.tryToGoDown(decor, players, robot());
      }
      if (robotInertia.d === "left") {
        engine.tryToGoLeft(decor, players, robot());
      }
      if (robotInertia.d === "right") {
        engine.tryToGoRight(decor, players, robot());
      }
    } else {
      const r = Math.round(Math.random() * 100);
      if (r > 0 && r <= 10) {
        setRobotInertia({ d: "up", t: t });
      } else if (r > 10 && r <= 20) {
        setRobotInertia({ d: "down", t: t });
      } else if (r > 20 && r <= 30) {
        setRobotInertia({ d: "left", t: t });
      } else if (r > 30 && r <= 40) {
        setRobotInertia({ d: "right", t: t });
      } else if (r > 40 && r <= 42) {
        dropBomb(robot());
      }
    }
  }
  setRobotInertia((old) => {
    return { d: old.d, t: old.t - 1 };
  });
}
