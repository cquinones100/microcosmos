import Gene from "./gene";
import Mutator from "./mutator";
import Organism from "./organisms/organism";

class GeneticCode {
  genes: Gene[];

  constructor(genes: Gene[] = []) {
    this.genes = genes || [];
  }

  animate() {
    this.forEach((gene: Gene) => gene.animate());
    this.forEach(Mutator.conditionallyMutate);
  }

  forEach(cb: { (gene: Gene): void; (value: Gene, index: number, array: Gene[]): void; }) {
    this.genes.forEach(cb);
  }

  map(cb: { (gene: Gene): void; (value: Gene, index: number, array: Gene[]): any; }) {
    return this.genes.map(cb);
  }

  duplicate(organism: Organism): GeneticCode {
    return new GeneticCode(this.map(gene => {
      return gene.duplicate(organism);
    }));
  }
}

export default GeneticCode;
