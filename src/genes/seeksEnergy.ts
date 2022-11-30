import { getDistance } from "geolib";
import Behavior from "../behavior";
import Detection from "../behavior/detection";
import Movement from "../behavior/movement";
import Gene from "../gene";
import HeteroTroph from "../organisms/heterotroph";
import Organism from "../organisms/organism";
import WorldObject from "../worldObject";

class SeeksEnergy extends Gene {
  detection: Detection;

  constructor(args: Organism) {
    super(args);

    this.detection = new Detection();
  }

  animate() {
    this.organism.scene.measure('seeking energy', this.resolve.bind(this));
  }

  resolve() {
    if (!this.organism.hungry()) return;
    if (!(this.organism instanceof HeteroTroph)) return;

    const movement = Behavior.findBehavior<Movement>(this.organism, (current) => current instanceof Movement);

    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    if (movement) {
      if (movement.speed === 0) movement.speed = movement.defaultSpeed;
      if (movement.xDirection === 0) movement.xDirection = negatableRandom(1);
      if (movement.yDirection === 0) movement.yDirection = negatableRandom(1);
    }

    let closestDistance = Infinity;
    let closestOrganism: Organism | undefined;
    let feeding = false;

    this.detection.onDetect = (obj: WorldObject, cancel: () => void) => {
      if (feeding) cancel();

      if (!(obj instanceof Organism)) return;

      const { x: currX, y: currY } = obj.getPosition();

      if (this.organism.canEat(obj)) {
        if (this.organism.intersects(currX, currY)) {
          closestOrganism = obj;

          feeding = true;
        } else {
          const { x: currX, y: currY } = obj.getPosition();
          const { x: latitude, y: longitude } = this.organism.getPosition();

          const distance = getDistance(
            { latitude: Math.round(latitude), longitude: Math.round(longitude) },
            { latitude: Math.round(currX), longitude: Math.round(currY) }
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestOrganism = obj;
          }
        }
      }
    };

    this.detection.call({ organism: this.organism });

    if (!closestOrganism) {
      movement.move({ organism: this.organism });

      return;
    }

    const { x: currX, y: currY } = closestOrganism.getPosition();

    if (this.organism.intersects(currX, currY)) {
      this.organism.consume(closestOrganism);
    } else {
      movement.directTo({ organism: this.organism, x: currX, y: currY });
      movement.move({ organism: this.organism })
    }
  }

  increase() {}

  duplicate(newOrganism: Organism): Gene {
    return new SeeksEnergy(newOrganism);
  }

  mutate() {}
}

export default SeeksEnergy;
