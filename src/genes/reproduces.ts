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

    console.log("mutating reproduction.maxCycles: ", this.reproduction.maxCycles);
  }

  private mutateIntervals() {
    const intervalMagnitude = Math.random() * 1000;

    this.reproduction.interval = intervalMagnitude;

    console.log("mutating reproduction.interval: ", this.reproduction.interval);
  }
}

export default Reproduces;
