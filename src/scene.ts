import * as PIXI from "pixi.js";
import Stats from 'stats.js'
import WorldObject from "./worldObject";
import Organism from "./organisms/organism";
import { Application, Container } from "pixi.js";
import TextureOrganism from "./textureOrganism";
import TextureAutotroph from "./textureAutotroph";
import Autotroph from "./organisms/autotroph";
import HeteroTroph from "./organisms/heterotroph";
import Physics, { Point } from "./utils/physics/physics";
import { create } from "./scenarios/default";
import DetectsTarget from "./behavior/detectsTarget";
import Coordinates, { Coords } from "./physics/coordinates";
import KDTree from './physics/kDTree';

export const MUTATION_FACTOR = 1;

const CHUNK_SIZE = 50;

class Scene {
  app: PIXI.Application;
  organisms: Set<Organism>;
  predators: Set<Organism>;
  paused: boolean;
  center: { x: number; y: number; };
  measurements: {
    [key: string]: number
  }
  timePassed: number;
  container: PIXI.Container<PIXI.DisplayObject>;
  stop: boolean;
  workerPool: Worker[];
  tree: KDTree | null;

  constructor() {
    this.organisms = new Set<Organism>();
    this.predators = new Set();
    this.paused = false;
    this.measurements = {};
    this.timePassed = 0;
    this.container = new Container();
    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight - 5,
      autoDensity: true,
      antialias: true,
      autoStart: false,
      backgroundColor: 0x333333,
      resolution: window.devicePixelRatio
    });
    this.center = { x: this.app.screen.width / 2, y: this.app.screen.height / 2 };
    this.stop = false;
    this.container.sortableChildren = true;
    this.workerPool = [
      new Worker(new URL('./utils/collisions.worker.ts', import.meta.url)),
      new Worker(new URL('./utils/collisions.worker.ts', import.meta.url)),
      new Worker(new URL('./utils/collisions.worker.ts', import.meta.url)),
      new Worker(new URL('./utils/collisions.worker.ts', import.meta.url)),
    ];
    this.tree = null;

    Physics.setScene(this);
  }

  draw() {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const { app } = this;

    document.body.appendChild(app.view as unknown as Node);


    app.stage.addChild(this.container);

    document.addEventListener("keydown", ({ key }) => {
      if (key === ' ') {
        this.stop = !this.stop;

        if (this.stop) {
          console.log("PAUSED");
          console.log(`MEASUREMENT Organisms: ${this.organisms.size}`);
          console.log(`MEASUREMENT Heterotrophs: ${Array.from(this.organisms).filter(org => org instanceof HeteroTroph).length}`);
          console.log(`MEASUREMENT Autotrophs: ${Array.from(this.organisms).filter(org => org instanceof Autotroph).length}`);
          Object.keys(this.measurements).forEach(measurement => {
            console.log(`MEASUREMENT ${measurement}: ${this.measurements[measurement]}`);
          });
        }
      }
    })

    document.addEventListener('keydown', ({ key }) => {
      if (key === 'r') {
        DetectsTarget.showRadius = !DetectsTarget.showRadius;
      }
    })

    this.container.interactive = true;

    this.app.stage.interactive = true;
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);

    create();

    this.app.stage.on('click', (event) => {
      const { width, height } = this.getDimensions();
      console.log(width, height)
      console.log(event.clientX, event.clientY);
    });

    let currentTime = 0;
    let nextTime = 1;

    const redraw = (timePassed: number) => {
      if (this.stop) return;

      Object.keys(this.measurements).forEach(measurement => { this.measurements[measurement] = 0 });

      Physics.setTime(timePassed);

      this.measure('build tree', () => {
        this.tree = KDTree.fromObjects(Array.from(this.organisms));
      })

      this.organisms.forEach(organism => {
        organism.animate();
      });

      Object.keys(this.measurements).forEach(measurement => {
        if (this.measurements[measurement]) {
          console.log(`MEASUREMENT ${measurement}: ${this.measurements[measurement]}`);
        }
      });

      currentTime = performance.now();

      if (nextTime - currentTime / 1000 < .001) {
        Physics.time = currentTime;
        console.log('time', nextTime);
        console.log('rawTime', Physics.time);

        nextTime += 1;
      }

      stats.end();
    }

    app.ticker.add(redraw);
    app.ticker.start();
  }

  createHeterotroph(
    { x, y, color }: { x: number, y: number, color?: number } = { x: 0, y: 0}
  ) {
    const texture = TextureOrganism.create();

    const organism = HeteroTroph.create({ texture });

    if (color) {
      organism.shape.shape.tint = color;
    }

    organism.setPosition({ x, y });

    this.organisms.add(organism);

    return organism;
  }

  createAutotroph({ x, y }: Coords = { x: 0, y: 0 }) {
    const texture = TextureAutotroph.create();

    const organism = Autotroph.create({ texture });

    organism.setPosition({ x, y });
    this.organisms.add(organism);

    return organism;
  }

  add(organism: Organism) {
    this.organisms.add(organism);
  }

  killOrganism(organism: Organism) {
    this.organisms.delete(organism);
  }

  remove(organism: Organism) {
    this.organisms.delete(organism);
    this.container.removeChild(organism.shape.shape);
  }

  getBounds() {
    const { width, height } = this.app.screen;

    return { width, height };
  }

  measure<T>(key: string, cb: () => T, sideEffect?: (elapsedTime: number, key: string, totalTime: number) => void): T {
    const startTime = Date.now();

    const result = cb();

    const endTime = Date.now();

    const delta = endTime - startTime;

    this.measurements[key] ||= 0;

    this.measurements[key] += delta;

    if (sideEffect) sideEffect(delta, key, this.measurements[key]);

    return result
  }

  getDimensions() {
    const { width, height } = this.app.screen

    return { width, height };
  }

  addObject(object: WorldObject) {
    Coordinates.withinObject(object, (cell) => {
      cell.add(object)
    });

    return Coordinates.snappedPosition(object);
  }

  removeObject(object: WorldObject) {
    Coordinates.withinObject(object, (cell) => {
      cell.delete(object)
    });
  }
}

export default Scene;
