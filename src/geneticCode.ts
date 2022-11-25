import Gene from "./gene";
import NewOrganism from "./newOrganism";
import RealOrganism from "./realOrganism";

class GeneticCode {
  genes: Gene[];

  constructor(genes: Gene[] = []) {
    this.genes = genes || [];
  }

  animate(organism: RealOrganism) {
    this.forEach((gene: Gene) => gene.animate(organism));
  }

  forEach(cb: { (gene: Gene): void; (value: Gene, index: number, array: Gene[]): void; }) {
    this.genes.forEach(cb);
  }

  map(cb: { (gene: Gene): void; (value: Gene, index: number, array: Gene[]): any; }) {
    return this.genes.map(cb);
  }

  duplicate(): GeneticCode {
    return new GeneticCode(this.map(gene => {
      return gene.duplicate();
    }));
  }
}

export default GeneticCode;
