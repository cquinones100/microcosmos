import RealOrganism from "./realOrganism";

abstract class Gene {
  organism: RealOrganism;

  constructor(organism: RealOrganism) {
    this.organism = organism;
  }
  abstract animate(): void;
  abstract resolve(): void;
  abstract increase(): void;
  abstract duplicate(newOrganism: RealOrganism): Gene;
  abstract mutate(): void;
}

export default Gene;
