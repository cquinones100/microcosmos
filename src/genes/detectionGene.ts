import Detection from "../behavior/detection";
import Gene from "../gene";
import RealOrganism from "../realOrganism";

class DetectionGene extends Gene {
  detection: Detection;

  constructor(organism: RealOrganism) {
    super(organism);

    this.detection = new Detection({ obj: this.organism });
  }

  animate(): void {
    this.resolve();
  }

  resolve(): void {
    this.organism.setBehavior(this.detection);
  }

  duplicate(newOrganism: RealOrganism): DetectionGene {
    const gene = new DetectionGene(newOrganism);

    gene.detection = this.detection.duplicate(newOrganism) || new Detection({ obj: newOrganism });

    return gene;
  }

  increase(): void {}
  mutate(): void {}
}

export default DetectionGene;