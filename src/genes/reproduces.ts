import Gene from "../gene";
import RealOrganism from "../realOrganism";
import Reproduction from "../reproduction";

class Reproduces extends Gene {
  reproduction: Reproduction;

  constructor(organism: RealOrganism) {
    super(organism);

    this.reproduction = new Reproduction({ obj: this.organism });
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
    const magnitude = Math.random() * 10;

    this.reproduction.maxCycles = magnitude;

    console.log("mutating reproduction.maxCycles: ", this.reproduction.maxCycles);
  }
}

export default Reproduces;
