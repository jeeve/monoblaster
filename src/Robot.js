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
  let inertia = { ...robotInertia };

  function flee() {
    function danger(n) {
      return decor[n].image.includes("bomb") || fires.includes(n);
    }
    let warning = false;
    const iRobot = Math.round(robot().x / 32);
    const jRobot = Math.round(robot().y / 32);
    const nRobot = util.getIndex(iRobot, jRobot);
    if (danger(nRobot)) {
      if (!something(util.spriteUp(nRobot))) {
        inertia.d = "up";
      } else if (!something(util.spriteDown(nRobot))) {
        inertia.d = "down";
      } else if (!something(util.spriteLeft(nRobot))) {
        inertia.d = "left";
      } else {
        inertia.d = "right";
      }
      warning = true;
    }
    if (danger(util.spriteLeft(nRobot)) || danger(util.spriteRight(nRobot))) {
      if (!something(util.spriteUp(nRobot))) {
        inertia.d = "up";
      } else {
        inertia.d = "down";
      }
      warning = true;
    }
    if (danger(util.spriteUp(nRobot)) || danger(util.spriteDown(nRobot))) {
      if (!something(util.spriteLeft(nRobot))) {
        inertia.d = "left";
      } else {
        inertia.d = "right";
      }
      warning = true;
    }
    return warning;
  }

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

  const warning = flee();

  if (inertia.t > 0) {
    if (inertia.d === "up") {
      engine.tryToGoUp(decor, players, robot());
    }
    if (inertia.d === "down") {
      engine.tryToGoDown(decor, players, robot());
    }
    if (inertia.d === "left") {
      engine.tryToGoLeft(decor, players, robot());
    }
    if (inertia.d === "right") {
      engine.tryToGoRight(decor, players, robot());
    }
  } else {
    if (!warning) {
      const r = Math.round(Math.random() * 100);
      if (r > 0 && r <= 10) {
        inertia.d = "up";
      } else if (r > 10 && r <= 20) {
        inertia.d = "down";
      } else if (r > 20 && r <= 30) {
        inertia.d = "left";
      } else if (r > 30 && r <= 40) {
        inertia.d = "right";
      } else if (r > 40 && r <= 50) {
        dropBomb(robot());
      }
    }
  }

  if (inertia.t === 0) {
    inertia.t = Math.round(Math.random()*init.robotAgitation);
  } else {
    inertia.t--;
  }

  setRobotInertia(inertia);
}
