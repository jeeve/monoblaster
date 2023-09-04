import * as init from "./init";
import * as util from "./util";
import * as engine from "./engine";

export function moveRobot(decor, robotInertia, setRobotInertia, players, robot, dropBomb, fires) {
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
      const iRobot = Math.floor(robot().x / 32);
      const jRobot = Math.floor(robot().y / 32);
      const nRobot = util.getIndex(iRobot, jRobot);
      const t = Math.round(Math.random() * init.robotAgitation) + 2;
      if (
        util.danger(util.spriteLeft(nRobot), decor, fires) ||
        util.danger(util.spriteRight(nRobot), decor, fires)
      ) {
        if (!util.something(decor, players, robot(), util.spriteUp(nRobot))) {
          setRobotInertia({ d: "up", t: t });
        } else {
          setRobotInertia({ d: "down", t: t });
        }
      } else if (
        util.danger(util.spriteUp(nRobot), decor, fires) ||
        util.danger(util.spriteDown(nRobot), decor, fires)
      ) {
        if (!util.something(decor, players, robot(), util.spriteLeft(nRobot))) {
          setRobotInertia({ d: "left", t: t });
        } else {
          setRobotInertia({ d: "right", t: t });
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

