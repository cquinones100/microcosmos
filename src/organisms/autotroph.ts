import Organism from "./organism";
import { OrganismProps } from "../organisms/organism";
import TextureAutotroph from "../textureAutotroph";
import Reproduction from "../behavior/reproduction";
import Physics from "../utils/physics/physics";

export type Coords = {
  x: number;
  y: number;
};

class Autotroph extends Organism {
  interval: number;
  maxIntervals: any;
  static defaultColor: number;
  public static create({ texture }: { texture: TextureAutotroph }) {
    const organism = new Autotroph({ shape: texture });

    const reproduction = new Reproduction(organism);

    reproduction.maxCycles = 1;
    reproduction.maxInterval = 1;

    organism.behaviors.push(reproduction);

    organism.shape.shape.zIndex = 0;

    return organism;
  }

  constructor({ shape, ...args }: OrganismProps) {
    super({ shape, ...args });

    this.interval = 0;
    this.maxIntervals = 100;
    this.defaultColor = 0x50B959;
    this.shape.shape.tint = this.defaultColor;
  }

  updateEnergyText(): void {}

  animate() {
    super.animate();

    this.interval += 1;

    if (this.interval < this.maxIntervals) this.setEnergy(this.energy + 1);
  }

  duplicate() {
    const { scene } = Physics;

    const texture = TextureAutotroph.create();
    const organism = Autotroph.create({ texture })

    scene!.organisms.add(organism);

    return organism;
  }

  canBeEatenBy(organism: Organism): boolean {
    return true;
  }

  die() {
    Physics.scene!.remove(this);
    this.disappear();
    super.die();
  }
}

export default Autotroph;
