import IBehavior from "../behavior";
import { initializeDuplicateBehavior } from "../duplication";
import Mutator from "../mutator";
import Autotroph from "../organisms/autotroph";
import Organism from "../organisms/organism";
import Coordinates from "../physics/coordinates";

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
    const { x: objX, y: objY } = this.organism.getPosition();
    const { width, height } = this.organism.getDimensions();

    if (this.organism instanceof Autotroph) this.organism.highlight();

    const newOrganism = this.organism.duplicate();

    this.organism.behaviors
      .forEach(behavior => behavior.duplicate(newOrganism));

    this.organism.energy = this.organism.energy / 2;
    newOrganism.energy = this.organism.energy / 2;

    newOrganism.behaviors.forEach(Mutator.conditionallyMutate);
    newOrganism.generation = this.organism.generation + 1;

    const callbacks = [];

    const left = Coordinates.canOccupy({
      x: objX - width - 1,
      y: objY,
      object: this.organism
    });

    const up = Coordinates.canOccupy({
      x: objX,
      y: objY - height - 1,
      object: this.organism
    });

    const right = Coordinates.canOccupy({
      x: objX + width + 2,
      y: objY,
      object: this.organism
    });

    const down = Coordinates.canOccupy({
      x: objX,
      y: objY + height + 2,
      object: this.organism
    });

    if (left) {
      callbacks.push(() => {
        newOrganism.setPosition({ x: objX - width - 1, y: objY });
      })
    }

    if (up) {
      callbacks.push(() => {
        newOrganism.setPosition({ x: objX, y: objY - height - 1 });
      })
    }

    if (right) {
      callbacks.push(() => {
        newOrganism.setPosition({ x: objX + width + 2, y: objY });
      })
    }

    if (down) {
      callbacks.push(() => {
        newOrganism.setPosition({ x: objX, y: objY + height + 2 });
      })
    }

    callbacks[Math.floor(Math.random() * callbacks.length)]?.();

    if (newOrganism instanceof Autotroph) newOrganism.highlight();
  }
}

export default Reproduction;
