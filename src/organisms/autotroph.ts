import Reproduces from "../genes/reproduces";
import WorldObject, { WorldObjectProps } from "../worldObject";
import { Circle, Rectangle } from "pixi.js";
import Organism from "./organism";
import { OrganismProps } from "../organisms/organism";
import RealOrganism from "../realOrganism";

export type Coords = {
  x: number;
  y: number;
};

type AutotrophType = OrganismProps;

class Autotroph extends Organism {
  constructor({ scene, shape, x = 0, y = 0, ...args }: AutotrophType) {
    shape.beginFill(0x50B959);
    shape.drawRoundedRect(scene.center.x, scene.center.y, 10, 10, 2);
    shape.interactive = true;
    shape.hitArea = new Circle(scene.center.x, scene.center.y, 10);

    super({ shape, scene, ...args });

    this.setPosition({ x, y })
    this.maxEnergy = 100000
    this.energy = this.maxEnergy;
  }

  animate() {
    this.geneticCode?.forEach(gene => {
      if (gene instanceof Reproduces) {
        gene.onMutateMaxCycles = (gene: Reproduces) => {}
        gene.onMutateIntervals = (gene: Reproduces) => {}

        gene.behavior.interval = 1;
        gene.behavior.maxCycles = 1;
      }
    })

    super.animate();

    this.setEnergy(this.energy + 200);
  }

  duplicate() {
    const organism = this.scene.createAutotroph();
    
    this.generation += 1;
    organism.generation = this.generation;

    const x = [-10, 0, 10][Math.round(Math.random() * 2)];
    const y = [-10, 0, 10][Math.round(Math.random() * 2)];

    organism.setPosition({ x: this.getAbsolutePosition().x + x, y: this.getAbsolutePosition().y + y });

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

      this.setPosition({ x: x + negatableRandom(20), y: y + negatableRandom(20) });
    }
  }

  die() {}
}

export default Autotroph;
