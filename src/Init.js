import * as Util from "./Util"

export const ni = 20;
export const nj = 15;
export const dx = 5;
export const tolx = 16;

export function makeDecor() {
    const sprites = [];
    for (let i = 0; i < nj; i++) {
      for (let j = 0; j < ni; j++) {
        if (i === 0 || i === nj - 1 || j === 0 || j === ni - 1) {
          sprites.push({
            x: Util.getI(sprites.length) * 32,
            y: Util.getJ(sprites.length) * 32,
            image: "rock.png",
            n: sprites.length-1,
            explode: false
          });
        } else {
          const k = Math.random();
          if (k > 0.2 && k <= 0.3) {
            sprites.push({
              x: Util.getI(sprites.length) * 32,
              y: Util.getJ(sprites.length) * 32,
              image: "rock.png",
              n: sprites.length-1,
              explode: false
            });
          } else if (k >= 0.3 && k < 0.5) {
            sprites.push({
              x: Util.getI(sprites.length) * 32,
              y: Util.getJ(sprites.length) * 32,
              image: "brick.png",
              n: sprites.length-1,
              explode: false
            });
          } else {
            sprites.push({
              x: Util.getI(sprites.length) * 32,
              y: Util.getJ(sprites.length) * 32,
              image: "",
              n: sprites.length-1,
              explode: false
            });
          }
        }
      }
    }
    return sprites;
  }