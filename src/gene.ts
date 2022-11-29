import Organism from "./organisms/organism";

abstract class Gene {
  organism: Organism;

  constructor(organism: Organism) {
    this.organism = organism;
  }
  abstract animate(): void;
  abstract resolve(): void;
  abstract increase(): void;
  abstract duplicate(newOrganism: Organism): Gene;
  abstract mutate(): void;
}

export default Gene;
