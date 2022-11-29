import Gene from "../gene";
import Organism from "../realOrganism";
import Reproduction from "../behavior/reproduction";

class Reproduces extends Gene {
  reproduction: Reproduction;
  behavior: Reproduction;
  onMutateMaxCycles: (gene: Reproduces) => void;
  onMutateIntervals: (gene: Reproduces) => void;

  constructor(organism: Organism) {
    super(organism);

    this.reproduction = new Reproduction();
    this.behavior = this.reproduction; 
    this.onMutateMaxCycles = (gene: Reproduces) => {
      const magnitude = Math.round(Math.random() * 10);

      gene.reproduction.maxCycles = magnitude;
    }

    this.onMutateIntervals = (gene: Reproduces) => {
      const intervalMagnitude = Math.round(Math.random() * 100);

      this.reproduction.interval = intervalMagnitude;
    }
  }

  animate() {
    this.resolve();
  }

  resolve() {
    this.organism.setBehavior(this.reproduction);
  }

  increase() {}

  duplicate(newOrganism: Organism) {
    return new Reproduces(newOrganism);
  }

  mutate() {
    [this.mutateIntervals, this.mutateMaxCycles][Math.round(Math.random())].bind(this)();
  }

  private mutateMaxCycles() {
    this.onMutateMaxCycles(this);
  }

  private mutateIntervals() {
    this.onMutateMaxCycles(this);
  }
}

export default Reproduces;
