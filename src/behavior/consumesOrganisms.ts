import { DEFAULT_ENERGY, IBehavior } from "../behavior";
import { initializeDuplicateBehavior } from "../duplication";
import Organism from "../organisms/organism";
import Physics from "../utils/physics/physics";
import DetectsTarget from "./detectsTarget";

class ConsumesOrganisms implements IBehavior {
  organism: Organism;
  detection: DetectsTarget | undefined;
  energy: number;

  constructor(organism: Organism) {
    this.organism = organism;
    this.energy = DEFAULT_ENERGY;
  }

  duplicate(duplicateOrganism: Organism): ConsumesOrganisms {
    return initializeDuplicateBehavior(this, new ConsumesOrganisms(duplicateOrganism));
  }

  mutate(): void {}

  call() {
    const detection = this.getDetection();

    for (let target of detection.targets) {
      if (this.organism.canEat(target)) {
        if (Physics.Collision.collides(this.organism, target)) {
          if (this.organism.canEat(target)) this.organism.consume(target);

          break;
        }
      }
    }
  }

  private getDetection() {
    return this.detection ||= DetectsTarget.for(this.organism);
  }
}

export default ConsumesOrganisms;