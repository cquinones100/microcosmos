import Gene from "../gene";
import Movement from "../movement";
import RealOrganism from "../realOrganism";

class MovementGene extends Gene {
  movement?: Movement;

  animate(organism: RealOrganism) {
    this.resolve(organism);
  }

  resolve(organism: RealOrganism) {
    this.movement ||= new Movement({ obj: organism });

    organism.setBehavior(this.movement);
  }

  increase(organism: RealOrganism) {}

  duplicate() {
    return new MovementGene();
  }
}

export default MovementGene;