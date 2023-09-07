import * as init from "./init";
import * as util from "./util";

export function moveRobot(
  decor,
  robotInertia,
  setRobotInertia,
  players,
  robot,
  dropBomb,
  fires
) {
  let inertia = robotInertia;

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
        robot().displacement = "up";
      } else if (!something(util.spriteDown(nRobot))) {
        robot().displacement = "down";
      } else if (!something(util.spriteLeft(nRobot))) {
        robot().displacement = "left";
      } else {
        robot().displacement = "right";
      }
      warning = true;
    }
    if (danger(util.spriteLeft(nRobot)) || danger(util.spriteRight(nRobot))) {
      if (!something(util.spriteUp(nRobot))) {
        robot().displacement = "up";
      } else {
        robot().displacement = "down";
      }
      warning = true;
    }
    if (danger(util.spriteUp(nRobot)) || danger(util.spriteDown(nRobot))) {
      if (!something(util.spriteLeft(nRobot))) {
        robot().displacement = "left";
      } else {
        robot().displacement = "right";
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

  if (!warning && inertia === 0) {
    const r = Math.round(Math.random() * 100);
    if (r > 0 && r <= 10) {
      robot().displacement = "up";
    } else if (r > 10 && r <= 20) {
      robot().displacement = "down";
    } else if (r > 20 && r <= 30) {
      robot().displacement = "left";
    } else if (r > 30 && r <= 40) {
      robot().displacement = "right";
    } else if (r > 40 && r <= 42) {
      dropBomb(robot());
    }
  }

  if (inertia === 0) {
    inertia = Math.round(Math.random() * init.robotAgitation);
  } else {
    inertia--;
  }

  setRobotInertia(inertia);
}
