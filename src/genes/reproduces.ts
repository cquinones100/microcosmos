import Gene from "../gene";
import RealOrganism from "../realOrganism";
import Reproduction from "../behavior/reproduction";

class Reproduces extends Gene {
  reproduction: Reproduction;

  constructor(organism: RealOrganism) {
    super(organism);

    this.reproduction = new Reproduction();
  }

  animate() {
    this.resolve();
  }

  resolve() {
    this.organism.setBehavior(this.reproduction);
  }

  increase() {}

  duplicate(newOrganism: RealOrganism) {
    return new Reproduces(newOrganism);
  }

  mutate() {
    [this.mutateIntervals, this.mutateMaxCycles][Math.round(Math.random())].bind(this)();
  }

  private mutateMaxCycles() {
    const magnitude = Math.random() * 10;

    this.reproduction.maxCycles = magnitude;
  }

  private mutateIntervals() {
    const intervalMagnitude = Math.round(Math.random() * 100);

    this.reproduction.interval = intervalMagnitude;
  }
}

export default Reproduces;
