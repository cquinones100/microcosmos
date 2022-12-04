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
    const { x, y } = this.organism.getPosition();
    const { width, height } = this.organism.getDimensions();
    const left = new Point(x - width, y);
    const up = new Point(x,  y - height);
    const right = new Point(x + width, y);
    const down = new Point(x,  y + height);
    
    const collisions: Organism[][] = [[], [], [], []];

    Physics.scene?.organisms.forEach((organism) => {
      if (organism === this.organism) return;

      [left, up, right, down].forEach((point, index) => {
         if(Physics.Collision.collides(organism, point))
          collisions[index].push(organism);
      });
    });

    const openSpaces = [left, right, up, down].filter((space, index) => {
      return collisions[index].length === 0;
    });

    const openSpace = openSpaces[Math.floor(Math.random() * openSpaces.length)];

    if (openSpace) {
      const newOrganism = this.organism.duplicate();

      this.organism.behaviors.forEach(behavior => behavior.duplicate(newOrganism));

      this.organism.energy = this.organism.energy / 2;
      newOrganism.energy = this.organism.energy / 2;

      newOrganism.behaviors.forEach(Mutator.conditionallyMutate)
      newOrganism.generation = this.organism.generation + 1;

      newOrganism.setPosition(openSpace.getPosition())
    }
  }
}

export default Reproduction;
