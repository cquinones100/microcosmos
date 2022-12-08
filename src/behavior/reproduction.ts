import IBehavior from "../behavior";
import { initializeDuplicateBehavior } from "../duplication";
import Mutator from "../mutator";
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

    const roundedX = Math.floor(objX);
    const roundedY = Math.floor(objY);

    // try left
    let left = true;

    for (let x = Math.floor(roundedX - width - (width / 2)); x < Math.floor(roundedX - (width / 2) - 1); x++) {
      for (let y = Math.floor(roundedY - (height / 2)); y < Math.floor(roundedY + (height / 2)); y++) {
        const curr = Physics.Coordinates.coordinates[x]?.[y]

        if (curr?.size > 0) {
          left = false;
        }
        
        break;
      }
    }

    // try up
    let up = true;

    for (let x = Math.floor(roundedX - (width / 2)); x < Math.floor(roundedX - (width / 2)); x++) {
      for (let y = Math.floor(roundedX - (height / 2)); y < Math.floor(roundedX + (height / 2)); y++) {
        const curr = Physics.Coordinates.coordinates[x]?.[y]

        if (curr?.size > 0) {
          up = false;
        }
        
        break;
      }
    }

    // try right
    let right = true;

    for (let x = Math.floor(roundedX + width + (width / 2)); x < Math.floor(roundedX + (width / 2) + 1); x++) {
      for (let y = Math.floor(roundedY - (height / 2)); y < Math.floor(roundedY + (height / 2)); y++) {
        const curr = Physics.Coordinates.coordinates[x]?.[y]

        if (curr?.size > 0) {
          right = false;
        }
        
        break;
      }
    }

    // try down
    let down = true;

    for (let x = Math.floor(roundedX - (width / 2)); x < Math.floor(roundedX - (width / 2)); x++) {
      for (let y = Math.floor(roundedX + (height / 2)); y < Math.floor(roundedX + height + (height / 2)); y++) {
        const curr = Physics.Coordinates.coordinates[x]?.[y]

        if (curr?.size > 0) {
          down = false;
        }
        
        break;
      }
    }

    if (left || up || right || down) {
      const newOrganism = this.organism.duplicate();

      this.organism.behaviors
        .forEach(behavior => behavior.duplicate(newOrganism));

      this.organism.energy = this.organism.energy / 2;
      newOrganism.energy = this.organism.energy / 2;

      newOrganism.behaviors.forEach(Mutator.conditionallyMutate);
      newOrganism.generation = this.organism.generation + 1;

      const callbacks = [];

      if (left) {
        callbacks.push(() => {
          newOrganism.setPosition({ x: Math.floor(roundedX - width), y: roundedY });
        })
      }

      if (up) {
        callbacks.push(() => {
          newOrganism.setPosition({ x: Math.floor(roundedX), y: roundedY - height });
        })
      }

      if (right) {
        callbacks.push(() => {
          newOrganism.setPosition({ x: Math.floor(roundedX + width), y: roundedY });
        })
      }

      if (down) {
        callbacks.push(() => {
          newOrganism.setPosition({ x: Math.floor(roundedX), y: roundedY + height });
        })
      }

      callbacks[Math.floor(Math.random() * callbacks.length)]?.();
    }
  }
}

export default Reproduction;
