import Organism from "./organism";
import { OrganismProps } from "../organisms/organism";
import TextureAutotroph from "../textureAutotroph";
import Reproduction from "../behavior/reproduction";

export type Coords = {
  x: number;
  y: number;
};

type AutotrophProps = {
  texture: TextureAutotroph;
}
& Pick<OrganismProps, "scene" | "generation" | "color">;

class Autotroph extends Organism {
  interval: number;
  maxIntervals: any;
  static defaultColor: number;
  public static create({ texture, ...args }: AutotrophProps) {
    const organism = new Autotroph({ shape: texture, ...args});

    const reproduction = new Reproduction(organism);

    reproduction.maxCycles = -Infinity;
    reproduction.maxInterval = 10;

    organism.behaviors.push(reproduction);

    organism.shape.shape.zIndex = 0;

    return organism;
  }

  constructor({ shape, ...args }: Omit<OrganismProps, 'x' | 'y'>) {
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
    const { width, height } = this.shape.getDimensions();
    const { scene } = this.shape;
    const { x, y } = this.getPosition();

    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    const texture = TextureAutotroph.create({ scene, x: x + negatableRandom(10), y: y + negatableRandom(10) });
    const organism = Autotroph.create({ texture, scene })

    scene.organisms.add(organism);

    return organism;
  }

  canBeEatenBy(organism: Organism): boolean {
    return true;
  }

  die() {
    this.scene.remove(this);
    this.disappear();
    super.die();
  }
}

export default Autotroph;
