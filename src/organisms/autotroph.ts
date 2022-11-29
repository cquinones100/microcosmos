import Reproduces from "../genes/reproduces";
import { WorldObjectProps } from "../worldObject";
import { Rectangle } from "pixi.js";
import Organism from "./organism";
import { OrganismProps } from "../organisms/organism";

export type Coords = {
  x: number;
  y: number;
};

type AutotrophType = OrganismProps;

class Autotroph extends Organism {
  constructor({ scene, shape, x = 0, y = 0, ...args }: AutotrophType) {
    shape.beginFill(0x00FF00);
    shape.drawRoundedRect(scene.center.x, scene.center.y, 10, 10, 2);
    shape.interactive = true;
    shape.hitArea = new Rectangle(scene.center.x, scene.center.y, 10);

    super({ shape, scene, ...args });

    console.log(x,y)

    this.setPosition({ x, y })
    this.maxEnergy = 10000;
    this.energy = this.maxEnergy;
  }

  animate() {
    this.geneticCode?.forEach(gene => {
      if (gene instanceof Reproduces) {
        gene.onMutateMaxCycles = (gene: Reproduces) => {}
        gene.behavior.interval = 5;
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

    const x = [-5, 0, 5][Math.round(Math.random() * 2)];
    const y = [-5, 0, 5][Math.round(Math.random() * 2)];

    organism.setPosition({ x: this.getAbsolutePosition().x + x, y: this.getAbsolutePosition().y + y });

    return organism;
  }

  canBeEatenBy(organism: Organism): boolean {
    return true;
  }

  onIntersection({ x, y }: Coords, runAnyway: () => void): void {
    runAnyway();
  }
}

export default Autotroph;
