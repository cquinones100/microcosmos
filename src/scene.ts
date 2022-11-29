import * as PIXI from "pixi.js";
import MovementGene from "./genes/movementGene";
import Reproduces from "./genes/reproduces";
import SeeksEnergy from "./genes/seeksEnergy";
import GeneticCode from "./geneticCode";
import RealOrganism from "./realOrganism";
import Stats from 'stats.js'
import DetectionGene from "./genes/detectionGene";
import Autotroph, { Coords } from "./organisms/autotroph";
import WorldObject from "./worldObject";
import Movement from "./behavior/movement";
import Organism from "./organisms/organism";

export const MUTATION_FACTOR = 1;

class Scene {
  app: PIXI.Application;
  organisms: Set<Organism>;
  predators: Set<Organism>;
  prey: Set<Organism>;
  naturalDeaths: Set<Organism>;
  allObjects: Set<WorldObject>;
  paused: boolean;
  center: { x: number; y: number; };
  coordinates: Set<WorldObject>[][];
  measurements: {
    [key: string]: number
  }
  onAnimates: (() => void)[];
  timePassed: number;

  constructor() {
    this.app = new PIXI.Application();
    this.organisms = new Set<Organism>();
    this.allObjects = new Set();
    this.predators = new Set();
    this.prey = new Set();
    this.naturalDeaths = new Set();
    this.paused = false;
    this.center = { x: this.app.screen.width / 2, y: this.app.screen.height / 2 };
    this.coordinates = [];
    this.measurements = {};
    this.onAnimates = [];
    this.timePassed = 0;
  }

  draw() {
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    document.body.appendChild(this.app.view as unknown as Node);
    document.addEventListener('keypress', (event) => {
      if (event.key === " ") this.paused = !this.paused;
    });

    this.createOrganism();
    this.createAutotroph();
    this.createAutotroph();

    let organismsCount = this.organisms.size;
    let maxOrganisms = organismsCount;

    this.app.ticker.add((time) => {
      this.timePassed = time;
      stats.begin();

      if (!this.paused) {
        Object.keys(this.measurements).forEach(measurement => {
          this.measurements[measurement] = 0;
        })

        this.organisms.forEach(organism => organism.animate());

        console.log(`MEASUREMENT: Number of organisms: ${Array.from(this.organisms).filter(org => org.energy > 0).length}`);

        Object.keys(this.measurements).forEach(measurement => {
          console.log(`MEASUREMENT: Number of organisms: ${Array.from(this.organisms).filter(org => org.energy > 0).length}, ${measurement} time: ${this.measurements[measurement]}`);
        })
      }

      maxOrganisms = Math.max(this.organisms.size, maxOrganisms);

      stats.end();
    });
  }

  createOrganism(
    { x, y, color }:
    { x?: number, y?: number, geneticCode?: GeneticCode, color?: number } = {}
  ) {
    const shape = new PIXI.Graphics();

    const scene = this;

    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;
    const organism = new RealOrganism({
      x: x || negatableRandom(this.app.screen.width / 2),
      y: y || negatableRandom(this.app.screen.height / 2),
      shape,
      scene
    });

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
    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    const organism = new Autotroph({
      x: x || negatableRandom(100),
      y: y || negatableRandom(200),
      scene: this,
      shape: new PIXI.Graphics(),
    });

    organism.geneticCode = new GeneticCode([
      new Reproduces(organism),
    ])

    this.add(organism);

    return organism;
  }

  add(organism: Organism) {
    this.organisms.add(organism);
    this.app.stage.addChild(organism.shape);
    this.allObjects.add(organism);
  }

  killOrganism(organism: Organism) {
    this.organisms.delete(organism);
  }

  remove(organism: Organism) {
    this.allObjects.delete(organism);
  }

  getBounds() {
    const { width, height } = this.app.screen;

    return { width, height };
  }

  measure(key: string, cb: () => void, sideEffect?: (elapsedTime: number, key: string, totalTime: number) => void) {
    const startTime = Date.now();

    const result = cb();

    const endTime = Date.now();

    const delta = endTime - startTime

    this.measurements[key] ||= 0;

    this.measurements[key] += delta;

    if (sideEffect) sideEffect(delta, key, this.measurements[key]);

    return result
  }

  onAnimate(db: () => void) {
    this.onAnimates ||= [];

    this.onAnimates.push(db);
  }
}

export default Scene;
