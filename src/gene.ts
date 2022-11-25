import RealOrganism from "./realOrganism";

abstract class Gene {
  abstract animate(organism: RealOrganism): void;
  abstract resolve(organism: RealOrganism): void;
  abstract increase(organism: RealOrganism): void;
  abstract duplicate(): Gene;
}

export default Gene;
