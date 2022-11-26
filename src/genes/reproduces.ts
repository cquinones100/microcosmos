import Gene from "../gene";
import RealOrganism from "../realOrganism";
import Reproduction from "../reproduction";

class Reproduces extends Gene {
  reproduction?: Reproduction;

  animate() {
    this.resolve();
  }

  resolve() {
    this.reproduction ||= new Reproduction({ obj: this.organism });

    this.organism.setBehavior(this.reproduction);
  }

  increase() {}

  duplicate(newOrganism: RealOrganism) {
    return new Reproduces(newOrganism);
  }

  mutate() {}
}

export default Reproduces;
