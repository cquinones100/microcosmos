import Behavior from "../behavior";
import Detection from "../behavior/detection";
import Movement from "../behavior/movement";
import Gene from "../gene";
import RealOrganism from "../realOrganism";
import WorldObject from "../worldObject";

class SeeksEnergy extends Gene {
  detection: Detection;

  constructor(args: RealOrganism) {
    super(args);

    this.detection = new Detection();
  }

  animate() {
    this.resolve();
  }

  resolve() {
    if (!this.organism.hungry()) return;

    const movement = Behavior.findBehavior<Movement>(this.organism, (current) => current instanceof Movement);

    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    if (movement) {
      if (movement.speed === 0) movement.speed = movement.defaultSpeed;
      if (movement.xDirection === 0 && movement.yDirection === 0) {
        movement.xDirection = negatableRandom(1);
        movement.yDirection = negatableRandom(1);
      }
    }

    this.detection.onDetect = (obj: WorldObject, breakDetection: () => void) => {
      if (!(obj instanceof RealOrganism)) return;

      if (!this.organism.scene.allObjects.has(obj)) return;

      if (this.organism.canEat(obj)) {
        const { x: currX, y: currY } = obj.getAbsolutePosition();

        if (this.organism.intersects(currX, currY)) {
          this.organism.consume(obj);

          breakDetection();
        } else {
          movement.directTo({ organism: this.organism, x: currX, y: currY });
        }
      }
    };

    this.detection.call({ organism: this.organism });
  }

  increase() {}

  duplicate(newOrganism: RealOrganism): Gene {
    return new SeeksEnergy(newOrganism);
  }

  mutate() {}
}

export default SeeksEnergy;
