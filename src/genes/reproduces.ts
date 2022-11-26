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
    console.log("mutating reproduction!")
    const increaseOrDecrease = [1,-1][Math.round(Math.random())];
    const magnitude = Math.random() * 10;

    this.reproduction.cycles -= Math.max(this.reproduction!.cycles * increaseOrDecrease * magnitude, 0);
  }
}

export default Reproduces;
