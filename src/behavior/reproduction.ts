import IBehavior from "../behavior";
import { initializeDuplicateBehavior } from "../duplication";
import Mutator from "../mutator";
import Organism from "../organisms/organism";
import Physics, { Point } from "../utils/physics/physics";

class Reproduction implements IBehavior {
  public static for(organism: Organism) {
    return organism.behaviors.find(behavior => behavior instanceof Reproduction) as Reproduction;
  }

  public static updateFor(organism: Organism, cb: (reproduction: Reproduction) => void) {
    const reproduction = Reproduction.for(organism);

    if (reproduction) cb(reproduction);
  }

  cycles: number;
  interval: number;
  maxCycles: number;
  organism: Organism;
  energy: number;
  maxInterval: number;
  minEnergy: number;

  constructor(organism: Organism) {
    this.organism = organism;
    this.cycles = 0;
    this.maxCycles = 10;
    this.interval = 0;
    this.maxInterval = 100;
    this.energy = 0;
    this.minEnergy = this.organism.maxEnergy * 0.4
  }

  duplicate(newOrganism: Organism): Reproduction {
    return initializeDuplicateBehavior(this, new Reproduction(newOrganism), behavior => {
      behavior.maxInterval = this.maxInterval;
      behavior.maxCycles = this.maxCycles;
      behavior.minEnergy = this.minEnergy;
    });
  };

  mutate() { }

  call() {
    this.interval += 1

    if (this.shouldReproduce()) {
      this.reproduce();

      this.cycles += 1;
      this.interval = 0;
    }
  }

  private shouldReproduce() {
    return this.interval >= this.maxInterval
      && this.cycles < this.maxCycles
      && this.organism.energy > this.minEnergy;
  }

  private reproduce() {
    const surrounding = Physics.scene!.getSurrounding(this.organism);
    const openSpaces = surrounding.filter(([_, space]) => {
      return space.size === 0;
    });

    const openSpace = openSpaces[Math.floor(Math.random() * openSpaces.length)]?.[0];

    if (openSpace) {
      const newOrganism = this.organism.duplicate();

      this.organism.behaviors
        .forEach(behavior => behavior.duplicate(newOrganism));

      this.organism.energy = this.organism.energy / 2;
      newOrganism.energy = this.organism.energy / 2;

      newOrganism.behaviors.forEach(Mutator.conditionallyMutate);
      newOrganism.generation = this.organism.generation + 1;

      const { x, y } = openSpace.getPosition()

      newOrganism.setPosition({ x, y });
    }
  }
}

export default Reproduction;
