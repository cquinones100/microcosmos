import * as PIXI from "pixi.js";
import MovementGene from "./genes/movementGene";
import Reproduces from "./genes/reproduces";
import SeeksEnergy from "./genes/seeksEnergy";
import GeneticCode from "./geneticCode";
import RealOrganism from "./realOrganism";

const BOUNDARY = 5;

class Scene {
  app: PIXI.Application;
  organisms: RealOrganism[];

  constructor() {
    this.app = new PIXI.Application();
    this.organisms = [];
  }

  draw() {
    document.body.appendChild(this.app.view as unknown as Node);
    this.createOrganism();
    const stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    this.app.ticker.add(() => {
      console.log("Number of organisms: ", this.organisms.length);

      this.organisms.forEach(organism => {
        organism.animate();
      })
    });
  }

  createOrganism() {
    const shape = new PIXI.Graphics();

    shape.beginFill(0xff0000);
    shape.drawCircle(100, 100, 10);

    const scene = this;
    const geneticCode = new GeneticCode([
      new MovementGene(),
      new SeeksEnergy(),
      new Reproduces()
    ])

    this.add(new RealOrganism({ shape, geneticCode, scene }))
  }

  add(organism: RealOrganism) {
    this.organisms.push(organism);
    this.app.stage.addChild(organism.shape);
  }
}

export default Scene;
