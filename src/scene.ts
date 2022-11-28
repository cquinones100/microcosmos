import * as PIXI from "pixi.js";
import MovementGene from "./genes/movementGene";
import Reproduces from "./genes/reproduces";
import SeeksEnergy from "./genes/seeksEnergy";
import GeneticCode from "./geneticCode";
import RealOrganism from "./realOrganism";
import Stats from 'stats.js'
import DetectionGene from "./genes/detectionGene";
import Autotroph, { Coords } from "./organisms/autotroph";
import { Circle } from "pixi.js";

export const MUTATION_FACTOR = 1;

class Scene {
  app: PIXI.Application;
  organisms: Set<RealOrganism>;
  predators: Set<RealOrganism>;
  prey: Set<RealOrganism>;
  naturalDeaths: Set<RealOrganism>;
  allObjects: any[];
  paused: boolean;
  center: { x: number; y: number; };

  constructor() {
    this.app = new PIXI.Application();
    this.organisms = new Set<RealOrganism>();
    this.allObjects = [];
    this.predators = new Set();
    this.prey = new Set();
    this.naturalDeaths = new Set();
    this.paused = false;
    this.center = { x: this.app.screen.width / 2, y: this.app.screen.height / 2 };
  }

  draw() {
    console.log("screen bounds coords: ", this.getBounds());
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    document.body.appendChild(this.app.view as unknown as Node);
    document.addEventListener('keypress', (event) => {
      if (event.key === " ") this.paused = !this.paused;
    });
    this.createOrganism();
    this.createAutotroph();

    let organismsCount = this.organisms.size;
    let maxOrganisms = organismsCount;

    let displayedStats = false;

    this.app.ticker.add(() => {
      stats.begin();

      if (!this.paused) {
        this.organisms.forEach(organism => organism.animate());
        console.log("Number of organisms: ", this.organisms.size);
      }

      if (this.organisms.size === 0 && !displayedStats) {
        console.log("------------------Run Stats-----------------");
        console.log("Max number of organisms: ", maxOrganisms);
        console.log("Predators: ", this.predators);
        console.log("Prey: ", this.prey);
        console.log("Died of starvation: ", this.naturalDeaths);

        displayedStats = true;
      }

      maxOrganisms = Math.max(this.organisms.size, maxOrganisms);

      stats.end();
    });
  }

  createOrganism(
    { x, y }:
    { x?: number, y?: number, geneticCode?: GeneticCode } = {}
  ) {
    const shape = new PIXI.Graphics();

    shape.beginFill(0xff0000);
    shape.drawCircle(this.center.x, this.center.y, 10);
    shape.interactive = true;
    shape.hitArea = new Circle(x, y, 10);

    const scene = this;

    const organism = new RealOrganism({ shape, scene });

    organism.geneticCode = new GeneticCode([
      new MovementGene(organism),
      new DetectionGene(organism),
      new SeeksEnergy(organism),
      new Reproduces(organism),
    ])

    this.add(organism);

    return organism;
  }

  createAutotroph({ x, y }: Partial<Coords> = {}) {
    const organism = new Autotroph({
      x: x || 100,
      y: y || -200,
      scene: this,
      shape: new PIXI.Graphics(),
    });

    organism.geneticCode = new GeneticCode([
      new Reproduces(organism),
    ])

    this.add(organism);

    return organism;
  }

  add(organism: RealOrganism) {
    this.organisms.add(organism);
    this.app.stage.addChild(organism.shape);
    this.allObjects.push(organism);
  }

  killOrganism(organism: RealOrganism) {
    this.organisms.delete(organism);
  }

  remove(organism: RealOrganism) {
    this.allObjects = this.allObjects.filter((curr: any) => {
      return curr !== organism;
    });
  }

  getBounds() {
    const { width, height } = this.app.screen;

    return { width, height };
  }
}

export default Scene;
