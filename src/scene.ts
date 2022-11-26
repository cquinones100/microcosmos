import * as PIXI from "pixi.js";
import MovementGene from "./genes/movementGene";
import Reproduces from "./genes/reproduces";
import SeeksEnergy from "./genes/seeksEnergy";
import GeneticCode from "./geneticCode";
import RealOrganism from "./realOrganism";
import Stats from 'stats.js'

const BOUNDARY = 5;

export const MUTATION_FACTOR = 1;

class Scene {
  app: PIXI.Application;
  organisms: Set<RealOrganism>;

  constructor() {
    this.app = new PIXI.Application();
    this.organisms = new Set<RealOrganism>();
  }

  draw() {
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    document.body.appendChild(this.app.view as unknown as Node);
    this.createOrganism({ x: this.app.screen.width / 2, y: this.app.screen.height / 2 });

    let organismsCount = this.organisms.size;

    this.app.ticker.add(() => {
      stats.begin();

      if (this.organisms.size !== organismsCount) {
        organismsCount = this.organisms.size;

        console.log("Number of organisms: ", organismsCount);
      }

      this.organisms.forEach(organism => organism.animate());

      stats.end();
    });
  }

  createOrganism(
    {
      x,
      y,
    }:
    { x: number, y: number, geneticCode?: GeneticCode }
  ) {
    const shape = new PIXI.Graphics();

    shape.beginFill(0xff0000);
    shape.drawCircle(x, y, 10);

    const scene = this;

    const organism = new RealOrganism({ shape, scene });

    organism.geneticCode = new GeneticCode([
      new MovementGene(organism),
      new SeeksEnergy(organism),
    ])

    this.add(organism);

    return organism;
  }

  add(organism: RealOrganism) {
    this.organisms.add(organism);
    this.app.stage.addChild(organism.shape);
  }

  remove(organism: RealOrganism) {
    this.organisms.delete(organism);
  }

  getBounds() {
    const { width, height } = this.app.screen;

    return { width, height };
  }
}

export default Scene;
