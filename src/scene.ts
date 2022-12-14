import * as PIXI from "pixi.js";
import Stats from 'stats.js'
import WorldObject from "./worldObject";
import Organism from "./organisms/organism";
import { Application, Container } from "pixi.js";
import TextureOrganism from "./textureOrganism";
import TextureAutotroph from "./textureAutotroph";
import Autotroph from "./organisms/autotroph";
import HeteroTroph from "./organisms/heterotroph";
import Physics, { ICollidableObject, Point } from "./utils/physics/physics";
import { create } from "./scenarios/performance";
import DetectsTarget from "./behavior/detectsTarget";
import Coordinates, { Coords } from "./physics/coordinates";

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

    const texture = create();

    this.app.stage.on('click', (event) => {
      const { width, height } = this.getDimensions();
      console.log(width, height)
      console.log(event.clientX, event.clientY);
    });

    const redraw = (timePassed: number) => {
      Object.keys(this.measurements).forEach(measurement => { this.measurements[measurement] = 0 });

      const sync = () => {
        Physics.setTime(timePassed);

        app.ticker.stop();
        return new Promise<void>((resolve, reject) => {
            this.prepareBroadPhaseDetection();

            this.organisms.forEach(organism => { 
              organism.animate();
            });
            
            Object.keys(this.measurements).forEach(measurement => {
              if (this.measurements[measurement] > 5) {
                console.log(`MEASUREMENT ${measurement}: ${this.measurements[measurement]}`);
              }
            });

            resolve();
          });
        };

      if (!this.stop) {
        sync().then(() => {
          app.ticker.start();

          stats.end();
        });
    }
    }

    app.ticker.add(redraw);
    app.ticker.start();
  }
  prepareBroadPhaseDetection() {
    const sortedOrganisms= Array.from(this.organisms).sort((a, b) => {
      const { x: aX } = a.getPosition();
      const { x: bX } = b.getPosition();

      if (aX < bX) {
        return -1;
      }

      if (aX > bX) {
        return 1;
      }

      return 0;
    });

    const intervals: ICollidableObject[][] = [[sortedOrganisms[0]]];

    for (let i = 1; i < sortedOrganisms.length; i++) {
      const currentInterval = intervals[intervals.length - 1];
      const curr = sortedOrganisms[i];

      const intersects = (curr: ICollidableObject, other: ICollidableObject) => {
        const { x: currX } = curr.getPosition();
        const { width: currWidth } = curr.getDimensions();

        const { x: otherX } = other.getPosition();
        const { width: otherWidth } = other.getDimensions();

        return currX - (currWidth / 2) < otherX + 50;
      }

      if (currentInterval.some(other => intersects(curr, other))) {
        intervals[intervals.length - 1].push(curr);
      } else {
        intervals.push([curr]);
      }
    }

    console.log(intervals);


    // set current interval to the first element

    // iterate through the list
      // for each element that intersects with any element in the interval on the axis, record an active interval
      // if element does not intersect, createa a new interval
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
