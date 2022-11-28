import { CubeRefractionMapping } from "three";
import Behavior from "../behavior";
import Detection from "../behavior/detection";
import Movement from "../behavior/movement";
import Gene from "../gene";
import RealOrganism from "../realOrganism";

class SeeksEnergy extends Gene {
  animate() {
    this.resolve();
  }

  resolve() {
    if (!this.organism.hungry()) return;

    const detection = Behavior.findBehavior<Detection>(this.organism, (current) => {
      return current instanceof Detection;
    });

    const movement = Behavior.findBehavior<Movement>(this.organism, (current) => current instanceof Movement);

    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    if (movement) {
      if (movement.speed === 0) movement.speed = movement.defaultSpeed;
      if (movement.xDirection === 0 && movement.yDirection === 0) {
        movement.xDirection = negatableRandom(1);
        movement.yDirection = negatableRandom(1);
      }
    }

    if (detection) {
      if (detection.detections.length > 0) {
        for (const curr of detection.detections) {
          if (!this.organism.scene.allObjects.find(obj => obj === curr)) continue;

          if (this.organism.canEat(curr)) {
            const { x: currX, y: currY } = curr.getAbsolutePosition();

            if (this.organism.intersects(currX, currY)) {
              this.organism.consume(curr);
            } else {
              movement.directTo({ organism: this.organism, x: currX, y: currY });
            }

            break;
          }
        }
      }
    }
  }

  increase() {}

  duplicate(newOrganism: RealOrganism): Gene {
    return new SeeksEnergy(newOrganism);
  }

  mutate() {}
}

export default SeeksEnergy;
