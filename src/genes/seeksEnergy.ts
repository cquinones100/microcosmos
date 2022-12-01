import { getDistance } from "geolib";
import Behavior from "../behavior";
import Detection from "../behavior/detection";
import Movement from "../behavior/movement";
import Gene from "../gene";
import HeteroTroph from "../organisms/heterotroph";
import Organism from "../organisms/organism";
import Physics from "../utils/physics/physics";
import WorldObject from "../worldObject";
export const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

class SeeksEnergy extends Gene {
  detection: Detection;
  interval: number;
  target: Organism | undefined;

  constructor(args: Organism) {
    super(args);

    this.detection = new Detection();
    this.interval = 0;
    this.target = undefined;
  }

  animate() {
    this.organism.scene.measure('seeking energy', this.resolve.bind(this));
  }

  resolve() {
    const movement = Movement.for<Movement>(this.organism);

    if (this.organism.hungry()) {
      if (this.target && this.organism.canEat(this.target)) {
        const { x, y } = this.target?.getPosition();

        if (Physics.Collision.collides(this.organism, this.target)) {
          this.organism.consume(this.target);

          return;
        } else {
          movement.directTo({
            organism: this.organism,
            x,
            y
          });

          return;
        }
      } else {
        this.target = undefined
      }

      const objs: WorldObject[] = [];

      this.detection.onDetect = (obj: WorldObject, cancel: () => void) => {
        objs.push(obj);
      };

      this.detection.call({ organism: this.organism });

      if (objs.length > 0) {
        const food = objs.find(obj => {
          return obj instanceof Organism && this.organism.canEat(obj);
        }) as Organism;

        if (food) {
          this.target = food;
        }
      } else {
        if (this.interval <= 0) {
          if (movement.speed === 0) movement.speed = movement.defaultSpeed;
          if (movement.xDirection === 0) movement.xDirection = negatableRandom(1);
          if (movement.yDirection === 0) movement.yDirection = negatableRandom(1);

          this.interval = 120;
        }
      }
    }

    this.interval -= 1;
  }

  increase() {}

  duplicate(newOrganism: Organism): Gene {
    return new SeeksEnergy(newOrganism);
  }

  mutate() {}
}

export default SeeksEnergy;
