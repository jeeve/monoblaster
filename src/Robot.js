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
  function flee() {
    function danger(n) {
      return decor[n].image.includes("bomb") || fires.includes(n);
    }
    let warning = false;
    const iRobot = Math.floor(robot().x / 32);
    const jRobot = Math.floor(robot().y / 32);
    const n = util.getIndex(iRobot, jRobot);
    if (danger(n)) {
      if (!something(util.spriteUp(n))) {
        setRobotInertia({ d: "up", t: t });
      } else if (!something(util.spriteDown(n))) {
        setRobotInertia({ d: "down", t: t });
      } else if (!something(util.spriteLeft(n))) {
        setRobotInertia({ d: "left", t: t });
      } else {
        setRobotInertia({ d: "right", t: t });
      }
      warning = true;
    }
    if (danger(util.spriteLeft(n)) || danger(util.spriteRight(n))) {
      if (!something(util.spriteUp(n))) {
        setRobotInertia({ d: "up", t: t });
      } else {
        setRobotInertia({ d: "down", t: t });
      }
      warning = true;
    }
    if (danger(util.spriteUp(n)) || danger(util.spriteDown(n))) {
      if (!something(util.spriteLeft(n))) {
        setRobotInertia({ d: "left", t: t });
      } else {
        setRobotInertia({ d: "down", t: t });
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

  const t = Math.round(Math.random() * init.robotAgitation) + 2;

  if (!flee()) {
    const r = Math.round(Math.random() * 100);
    if (r > 0 && r <= 10) {
      setRobotInertia({ d: "up", t: t });
    } else if (r > 10 && r <= 20) {
      setRobotInertia({ d: "down", t: t });
    } else if (r > 20 && r <= 30) {
      setRobotInertia({ d: "left", t: t });
    } else if (r > 30 && r <= 40) {
      setRobotInertia({ d: "right", t: t });
    } else if (r > 40 && r <= 50) {
      dropBomb(robot());
    }
  }

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
  }

  setRobotInertia((old) => {
    if (old.t === 0) {
      return {
        d: old.d,
        t: Math.round(Math.random() * init.robotAgitation) + 2,
      };
    } else {
      return { d: old.d, t: old.t - 1 };
    }
  });
}
