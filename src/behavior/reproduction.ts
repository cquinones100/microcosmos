import IBehavior from "../behavior";
import { initializeDuplicateBehavior } from "../duplication";
import Mutator from "../mutator";
import Autotroph from "../organisms/autotroph";
import Organism from "../organisms/organism";
import Physics, { Point } from "../utils/physics/physics";

class Reproduction implements IBehavior {
  debuggerTrack: boolean = false;

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

    this.organism.shape.shape.interactive = true
    this.organism.shape.shape.on("click", () => {
      console.log(this);
      this.debuggerTrack = true;
      console.log("surrounded?", this.organism.surrounded());
      console.log("Reproduction: reached max interval", this.reachedIntervalMax());
      console.log("Reproduction: below max cycles", !this.reachedCycleMax());
      console.log("Reproduction: has enough energy", this.hasEnoughEnergy());
    });
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
    if (!this.debuggerTrack) {
      this.organism.shape.shape.tint = this.organism.defaultColor!;
    } else {
      this.organism.shape.shape.tint = 0xE0AF6B;
    }
    this.interval += 1

    if (this.shouldReproduce()) {
      this.reproduce();

      this.cycles += 1;
      this.interval = 0;
    }
  }

  shouldReproduce() {
    return this.reachedIntervalMax()
      && !this.reachedCycleMax()
      && this.hasEnoughEnergy()
  }

  reachedIntervalMax() {
    return this.interval >= this.maxInterval;
  }

  reachedCycleMax() {
    return this.cycles >= this.maxCycles;
  }

  hasEnoughEnergy() {
    return this.organism.energy > this.minEnergy;
  }

  private reproduce() {
    const surrounding = Physics.scene!.getSurrounding(this.organism);
    const { x, y } = this.organism.getPosition();
    console.log(x, y)
    const { width, height } = this.organism.getDimensions();

    const left = new Point(Math.floor(x - (width / 2)) - 1, Math.floor(y));
    const right = new Point(Math.floor(x + (width / 2)) + 1, Math.floor(y));

    const up = new Point(Math.floor(x), Math.floor(y - (height / 2)) + 1);
    const down = new Point(Math.floor(x), Math.floor(y + (height / 2)) - 1);

    const points = [left, right, up, down];

    if (this.debuggerTrack) debugger;

    const spaces: string | any[] = [];

    surrounding.forEach(([point, space], index) => {
      if (space?.size === 0) spaces[index] = points[index];
    });

    let openSpace;

    const openSpaceIndex = Math.floor(Math.random() * spaces.length);

    if (this.organism instanceof Autotroph) {
      openSpace = spaces[openSpaceIndex];
    } else {
      openSpace = spaces[0];
    }

    if (this.debuggerTrack && this.reachedIntervalMax()) {
      debugger;
    }

    if (openSpace) {
      const newOrganism = this.organism.duplicate();

      this.organism.behaviors
        .forEach(behavior => behavior.duplicate(newOrganism));

      this.organism.energy = this.organism.energy / 2;
      newOrganism.energy = this.organism.energy / 2;

      newOrganism.behaviors.forEach(Mutator.conditionallyMutate);
      newOrganism.generation = this.organism.generation + 1;

      Reproduction.for(newOrganism).maxCycles = -Infinity;

      const { x, y } = down.getPosition()

      newOrganism.setPosition({ x, y });
    }
  }
}

export default Reproduction;
