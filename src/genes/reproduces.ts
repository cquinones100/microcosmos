import Gene from "../gene";
import RealOrganism from "../realOrganism";
import Reproduction from "../reproduction";

class Reproduces extends Gene {
  reproduction?: Reproduction;

  animate(organism: RealOrganism) {
    this.resolve(organism);
  }

  resolve(organism: RealOrganism) {
    this.reproduction ||= new Reproduction({ obj: organism });

    organism.setBehavior(this.reproduction);
  }

  increase(organism: RealOrganism) {}

  duplicate() {
    return new Reproduces();
  }
}

export default Reproduces;
