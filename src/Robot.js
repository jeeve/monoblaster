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

  function flee(n) {
    function danger(n) {
      return decor[n].image.includes("bomb") || fires.includes(n);
    }

    let d = "";

    if (danger(n)) {
      if (!something(util.spriteUp(n))) {
        d = "up";
      } else if (!something(util.spriteDown(n))) {
        d = "down";
      } else if (!something(util.spriteLeft(n))) {
        d = "left";
      } else {
        d = "right";
      }
    }
    if (danger(util.spriteLeft(n)) || danger(util.spriteRight(n))) {
      if (!something(util.spriteUp(n))) {
        d = "up";
      } else {
        d = "down";
      }
    }
    if (danger(util.spriteUp(n)) || danger(util.spriteDown(n))) {
      if (!something(util.spriteLeft(n))) {
        d = "left";
      } else {
        d = "right";
      }
    }
    return d;
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

  const iRobot = Math.round(robot().x / 32);
  const jRobot = Math.round(robot().y / 32);
  const nRobot = util.getIndex(iRobot, jRobot);
  const d1 = flee(nRobot);
  let d2 = "";
  switch (d1) {
    case "up":
      d2 = flee(util.spriteUp(nRobot));
      break;
    case "down":
      d2 = flee(util.spriteDown(nRobot));
      break;
    case "left":
      d2 = flee(util.spriteLeft(nRobot));
      break;
    case "right":
      d2 = flee(util.spriteRight(nRobot));
      break;
    default:
      break;
  }

  if (d2 !== "") {
    robot().displacement = d2;
  } else {
    if (d1 !== "") {
      robot().displacement = d1;
    }
  }

  if (d1 === "" && d2 === "" && inertia === 0) {
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
