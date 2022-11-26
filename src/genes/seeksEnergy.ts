import Behavior from "../behavior";
import Detection from "../behavior/detection";
import Gene from "../gene";
import Movement from "../movement";
import RealOrganism from "../realOrganism";

class SeeksEnergy extends Gene {
  animate() {
    this.resolve();
  }

  resolve() {
    if (!this.organism.hungry()) return;

    const detection = Behavior.findBehavior(this.organism, (current) => {
      return current instanceof Detection;
    });

    if (detection) {
      if (detection.detections.length > 0) {
        detection.detections.forEach((curr: any) => {
          if (!this.organism.scene.allObjects.find(obj => obj === curr)) return;

          const { x: objX, y: objY } = this.organism.getAbsolutePosition();
          const { x: currX, y: currY } = curr.getAbsolutePosition();

          const { width, height } = this.organism.getDimensions();

          if (currX >= objX - width && currX <= objX + width && currY >= objY - height && currY <= objY + height) {
            if (this.organism.energy - curr.energy > curr.energy * 1.5) {
              this.organism.consume(curr);
            }
          }
        });
      }
    }

    const movement = Behavior.findBehavior(this.organism, (current) => current instanceof Movement);

    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    if (movement) {
      if (movement.speed === 0) movement.speed = movement.defaultSpeed;
      if (movement.xDirection === 0) movement.xDirection = negatableRandom(1);
      if (movement.yDirection === 0) movement.yDirection = negatableRandom(1);
    }
  }

  increase() {}

  duplicate(newOrganism: RealOrganism): Gene {
    return new SeeksEnergy(newOrganism);
  }

  mutate() {}
}

export default SeeksEnergy;
