import * as Init from "./Init";
import * as Util from "./Util";
import * as Engine from "./Engine";

export function moveRobot(decor, robotInertia, setRobotInertia, players, robot, setRobot, dropBomb, fires) {
    if (robotInertia.t > 0) {
      if (robotInertia.d === "up") {
        Engine.tryToGoUp(decor, players, robot(), setRobot);
      }
      if (robotInertia.d === "down") {
        Engine.tryToGoDown(decor, players, robot(), setRobot);
      }
      if (robotInertia.d === "left") {
        Engine.tryToGoLeft(decor, players, robot(), setRobot);
      }
      if (robotInertia.d === "right") {
        Engine.tryToGoRight(decor, players, robot(), setRobot);
      }
    } else {
      const iRobot = Math.floor(robot().x / 32);
      const jRobot = Math.floor(robot().y / 32);
      const nRobot = Util.getIndex(iRobot, jRobot);
      const t = Math.round(Math.random() * Init.robotAgitation) + 2;
      if (
        Util.danger(Util.spriteLeft(nRobot), decor, fires) ||
        Util.danger(Util.spriteRight(nRobot), decor, fires)
      ) {
        if (!Util.something(decor, players, robot(), Util.spriteUp(nRobot))) {
          setRobotInertia({ d: "up", t: t });
        } else {
          setRobotInertia({ d: "down", t: t });
        }
      } else if (
        Util.danger(Util.spriteUp(nRobot), decor, fires) ||
        Util.danger(Util.spriteDown(nRobot), decor, fires)
      ) {
        if (!Util.something(decor, players, robot(), Util.spriteLeft(nRobot))) {
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

