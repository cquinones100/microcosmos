import IBehavior from "../behavior";
import { initializeDuplicateBehavior } from "../duplication";
import Mutator from "../mutator";
import Organism from "../organisms/organism";

class Reproduction implements IBehavior {
  public static for(organism: Organism) {
    return organism.behaviors.find(behavior => behavior instanceof Reproduction);
  }

  timePassed: number;
  cycles: number;
  interval: number;
  maxCycles: number;
  organism: Organism;
  energy: number;

  constructor(organism: Organism) {
    this.organism = organism;
    this.timePassed = 0;
    this.cycles = 0;
    this.interval = 100;
    this.maxCycles = 10;
    this.energy = 0;
  }

  duplicate(newOrganism: Organism): Reproduction {
    return initializeDuplicateBehavior(this, new Reproduction(newOrganism));
  };

  mutate() {
  }

  call() {
    this.energy = this.organism.energy / 2;
    this.timePassed += 1;

    if (this.shouldReproduce()) {
      this.reproduce();

      this.cycles += 1;
    }
  }

  private shouldReproduce() {
    return this.timePassed % this.interval === 0
      && this.cycles < this.maxCycles
      && this.organism.energy > this.organism.maxEnergy * 0.4;
  }

  private reproduce() {
    const organism = this.organism.duplicate();

    this.organism.behaviors.forEach(behavior => behavior.duplicate(organism));

    this.organism.energy = this.organism.energy / 2;
    organism.energy = this.organism.energy / 2;

    organism.behaviors.forEach(Mutator.conditionallyMutate)
    organism.generation = this.organism.generation + 1;
  }
}

export default Reproduction;
