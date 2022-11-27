import RealOrganism, { RealOrganismProps } from "../realOrganism";
import GeneticCode from "../geneticCode";
import Reproduces from "../genes/reproduces";

export type Coords = {
  x: number;
  y: number;
};

type AutotrophType = Exclude<RealOrganismProps, 'shape'>
  & Coords
  & Partial<{ shape?: RealOrganismProps['shape'] }>;

class Autotroph extends RealOrganism {
  constructor({ scene, shape, x, y, ...args }: AutotrophType) {
    shape.beginFill(0x00FF00);
    shape.drawRoundedRect(x, y, 10, 10, 2);

    super({ shape, scene, ...args });

    this.geneticCode = new GeneticCode([
      new Reproduces(this),
    ]);
  }

  animate() {
    super.animate();

    this.setEnergy(this.energy + 200);
  }

  duplicate() {
    const { x, y } = this.getAbsolutePosition();

    return this.scene.createAutotroph({ x: x - this.shape.width, y: y - this.shape.height, });
  }

  canBeEatenBy(organism: RealOrganism): boolean {
    return true;
  }
}

export default Autotroph;
