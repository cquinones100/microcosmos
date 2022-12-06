import * as PIXI from "pixi.js";
import Stats from 'stats.js'
import WorldObject from "./worldObject";
import Organism from "./organisms/organism";
import { Application, Container } from "pixi.js";
import TextureOrganism from "./textureOrganism";
import TextureAutotroph from "./textureAutotroph";
import Autotroph, { Coords } from "./organisms/autotroph";
import HeteroTroph from "./organisms/heterotroph";
import Physics, { Point } from "./utils/physics/physics";
import { create } from "./scenarios/reproduction";
import DetectsTarget from "./behavior/detectsTarget";

export const MUTATION_FACTOR = 1;

const CHUNK_SIZE = 50;

class Scene {
  app: PIXI.Application;
  organisms: Set<Organism>;
  predators: Set<Organism>;
  paused: boolean;
  center: { x: number; y: number; };
  coordinates: Set<WorldObject>[][];
  measurements: {
    [key: string]: number
  }
  timePassed: number;
  container: PIXI.Container<PIXI.DisplayObject>;
  stop: boolean;
  workerPool: Worker[];
  timePassedMS: number = 0;

  constructor() {
    this.organisms = new Set<Organism>();
    this.predators = new Set();
    this.paused = false;
    this.coordinates = [];
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

          debugger;
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

    this.app.stage.on('click', (event) => {
      console.log(event.clientX, event.clientY);
    });

    create(this);

    const redraw = (timePassed: number) => {
      Object.keys(this.measurements).forEach(measurement => { this.measurements[measurement] = 0 });

      let count = this.workerPool.length;
      const sync = () => {
        stats.begin();
        this.timePassed = timePassed;
        this.timePassedMS = app.ticker.deltaMS;

        app.ticker.stop();
        return new Promise<void>((resolve, reject) => {
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

  createHeterotroph(
    { x, y, color }
      : { x?: number, y?: number, color?: number }
      = {}
  ) {
    const texture = TextureOrganism.create({
      scene: this,
      x: x === undefined ? Math.random() * this.app.screen.width : x,
      y: y === undefined ? Math.random() * this.app.screen.height : y
    });

    const organism = HeteroTroph.create({ texture, scene: this });

    if (color) {
      organism.shape.shape.tint = color;
    }

    this.organisms.add(organism);

    return organism;
  }

  createAutotroph({ x, y }: Partial<Coords> = {}) {
    const texture = TextureAutotroph.create({
      scene: this,
      x: x === undefined ? Math.random() * this.app.screen.width : x,
      y: y === undefined ? Math.random() * this.app.screen.height : y
    });

    const organism = Autotroph.create({ texture, scene: this })

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
    const { x: objX, y: objY } = object.getPosition();
    const { width, height } = object.getDimensions();

    const roundedX = Math.round(objX);
    const roundedY = Math.round(objY);

    for (let x = roundedX - (width / 2); x < roundedX + (width / 2); x++) {
      for (let y = roundedY - -(height / 2); y < roundedY + (height / 2); y++) {
        debugger;
        if (x > 0 && y > 0) {
          this.coordinates[x] ||= [];
          this.coordinates[x][y] ||= new Set();

          this.coordinates[x][y].add(object);
        }
      }
    }

    return { x: roundedX, y: roundedY };
  }

  removeObject(object: WorldObject) {
    const { x: objX, y: objY } = object.getPosition();
    const { width, height } = object.getDimensions();

    const x = Math.round(objX);
    const y = Math.round(objY);
    const roundedX = Math.round(objX);
    const roundedY = Math.round(objY);

    for (let x = roundedX; x < roundedX + width; x++) {
      for (let y = roundedY; y < roundedY + height; y++) {
        this.coordinates[x] ||= [];
        this.coordinates[x][y] ||= new Set();

        this.coordinates[x][y].delete(object);
      }
    }
  }

  getSurrounding(object: WorldObject): [Point, Set<WorldObject>][] {
    const { x, y } = object.getPosition();
    const { width, height } = object.getDimensions();

    const left = new Point(Math.floor(x - (width / 2)) - 1, Math.floor(y));
    const right = new Point(Math.floor(x + (width / 2)) + 1, Math.floor(y));

    const up = new Point(Math.floor(x), Math.floor(y - (height / 2)) + 1);
    const down = new Point(Math.floor(x), Math.floor(y + (height / 2)) - 1);

    const points = [];

    return [left, up, right, down].map((point) => {
      const { x, y } = point.getPosition();

      return [point, this.coordinates[x]?.[y]];
    });
  }
}

export default Scene;
