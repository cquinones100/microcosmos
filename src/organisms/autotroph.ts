import WorldObject from "../worldObject";
import Organism from "./organism";
import { OrganismProps } from "../organisms/organism";
import TextureAutotroph from "../textureAutotroph";
import Reproduction from "../behavior/reproduction";
import Physics from "../utils/physics/physics";

export type Coords = {
  x: number;
  y: number;
};

type AutotrophProps = {
  texture: TextureAutotroph;
}
& Partial<Coords>
& Pick<OrganismProps, "scene" | "generation" | "color">;

class Autotroph extends Organism {
  interval: number;
  maxIntervals: any;
  static defaultColor: number;
  public static create({ texture, ...args }: AutotrophProps) {
    const { x, y } = texture.getPosition();

    const organism = new Autotroph({ x, y, shape: texture, ...args});

    const reproduction = new Reproduction(organism);

    reproduction.maxCycles = Infinity;
    reproduction.maxInterval = 10;

    organism.behaviors.push(reproduction);

    organism.setPosition({ x, y });
    organism.shape.shape.zIndex = 0;

    return organism;
  }

  constructor({ x, y, ...args }: OrganismProps) {
    super({ x, y, ...args });

    if (x !== undefined && y !== undefined) {
      this.setPosition({ x, y });
    }

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

  onIntersection({ x, y }: Coords, intersectionObject: WorldObject, runAnyway: () => void): void {
    if (intersectionObject instanceof Organism && this.canBeEatenBy(intersectionObject)) {
      runAnyway();
    } else {
      const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

      this.setPosition({ x: x + negatableRandom(10), y: y + negatableRandom(10) });
    }
  }

  die() {
    this.scene.remove(this);
    this.disappear();
    super.die();
  }
}

export default Autotroph;
