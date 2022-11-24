import Gene from "../gene";
import RealOrganism from "../realOrganism";

class MovementSpeedGene extends Gene {
  animate(organism: RealOrganism): void {}

  resolve(organism: RealOrganism) {}
  increase(organism: RealOrganism) {}
}

export default MovementSpeedGene;
