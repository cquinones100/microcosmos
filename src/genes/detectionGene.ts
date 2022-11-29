import Detection from "../behavior/detection";
import Gene from "../gene";
import Organism from "../organisms/organism";

class DetectionGene extends Gene {
  detection: Detection;

  constructor(organism: Organism) {
    super(organism);

    this.detection = new Detection();
  }

  animate(): void {
    this.resolve();
  }

  resolve(): void {
    this.organism.setBehavior(this.detection);
  }

  duplicate(newOrganism: Organism): DetectionGene {
    const gene = new DetectionGene(newOrganism);

    gene.detection = this.detection.duplicate() || new Detection();

    return gene;
  }

  increase(): void {}
  mutate(): void {}
}

export default DetectionGene;
