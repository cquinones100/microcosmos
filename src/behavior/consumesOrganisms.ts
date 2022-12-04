import { IBehavior } from "../behavior";
import Organism from "../organisms/organism";
import Physics from "../utils/physics/physics";
import DetectsTarget from "./detectsTarget";

class ConsumesOrganisms implements IBehavior {
  organism: Organism;
  detection: DetectsTarget | undefined;

  constructor(organism: Organism) {
    this.organism = organism;
  }

  call() {
    const detection = this.getDetection();

    detection.targets.forEach(target => {
      if (this.organism.canEat(target)) {
        if (Physics.Collision.collides(this.organism, target)) {
          target.die();
          target.disappear();
        }
      }
    });
  }

  private getDetection() {
    return this.detection ||= DetectsTarget.for(this.organism);
  }
}

export default ConsumesOrganisms;