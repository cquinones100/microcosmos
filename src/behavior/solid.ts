import { IBehavior } from "../behavior";
import { initializeDuplicateBehavior } from "../duplication";
import Organism from "../organisms/organism";
import Physics from "../utils/physics/physics";

class Solid implements IBehavior {
  organism: Organism;
  energy: number;

  constructor(organism: Organism) {
    this.organism = organism;
    this.energy = 0;
  }

  duplicate(duplicateOrganism: Organism): IBehavior {
    return initializeDuplicateBehavior(this, new Solid(duplicateOrganism));
  }

  mutate(): void {}

  call() {
    const { x, y } = this.organism.getPosition();
    const { width, height } = this.organism.getDimensions();

    for (let organism of Physics.scene!.organisms) {
      if (organism !== this.organism) {
        const { x: targetX, y: targetY } = organism.getPosition();

        const vector = Physics.Vector.getVector({ x, y, targetX, targetY });

        if (vector.getLengthSquared() < width * width) {
        }
      }
    }
  };
}

export default Solid;