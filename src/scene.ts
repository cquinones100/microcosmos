import * as PIXI from "pixi.js";
import Stats from 'stats.js'
import WorldObject from "./worldObject";
import Organism from "./organisms/organism";
import { Application, Container } from "pixi.js";
import TextureOrganism from "./textureOrganism";
import TextureAutotroph from "./textureAutotroph";
import Autotroph, { Coords } from "./organisms/autotroph";
import HeteroTroph from "./organisms/heterotroph";
import { create } from "./scenarios/movement";

export const MUTATION_FACTOR = 1;

const CHUNK_SIZE = 50;

class Scene {
  app: PIXI.Application;
  organisms: Set<Organism>;
  predators: Set<Organism>;
  prey: Set<Organism>;
  naturalDeaths: Set<Organism>;
  paused: boolean;
  center: { x: number; y: number; };
  coordinates: Set<WorldObject>[][];
  measurements: {
    [key: string]: number
  }
  onAnimates: (() => void)[];
  timePassed: number;
  container: PIXI.Container<PIXI.DisplayObject>;
  stop: boolean;
  allObjects: Set<WorldObject>[][];

  constructor() {
    this.organisms = new Set<Organism>();
    this.predators = new Set();
    this.prey = new Set();
    this.naturalDeaths = new Set();
    this.paused = false;
    this.coordinates = [];
    this.measurements = {};
    this.onAnimates = [];
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
    this.allObjects = Array.from(Array(Math.ceil(this.app.screen.width / CHUNK_SIZE))).map(() => {
      return Array.from(Array(Math.ceil(this.app.screen.height / CHUNK_SIZE))).map(() => new Set());
    });
    this.stop = false;
    this.container.sortableChildren = true;
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
          console.log(this.allObjects);
          console.log(`MEASUREMENT Organisms: ${this.organisms.size}`);
          console.log(`MEASUREMENT Heterotrophs: ${Array.from(this.organisms).filter(org => org instanceof HeteroTroph).length}`);
          console.log(`MEASUREMENT Autotrophs: ${Array.from(this.organisms).filter(org => org instanceof Autotroph).length}`);
          Object.keys(this.measurements).forEach(measurement => {
            console.log(`MEASUREMENT ${measurement}: ${this.measurements[measurement]}`);
          });
        }
      }
    })

    create(this);

    const worker = new Worker(new URL('./utils/collisions.worker.ts', import.meta.url))

    const redraw = (timePassed: number) => {
      Object.keys(this.measurements).forEach(measurement => { this.measurements[measurement] = 0 });

      const sync = () => {
        stats.begin();
        this.timePassed = timePassed;

        app.ticker.stop();
        console.log('-----------------------') 
        return new Promise<void>((resolve, reject) => {
          this.organisms.forEach(organism => organism.animate());

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
    // this.allObjects.add(organism);
  }

  killOrganism(organism: Organism) {
    this.organisms.delete(organism);
  }

  remove(organism: Organism) {
    // this.allObjects.delete(organism);
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

  onAnimate(db: () => void) {
    this.onAnimates ||= [];

    this.onAnimates.push(db);
  }

  getDimensions() {
    return { width: this.app.screen.width, height: this.app.screen.width };
  }

  setPosition({ x: objX, y: objY }: Coords, object: WorldObject) {
    const { x, y } = this.getPosition({ x: objX, y: objY });

    try {
      this.allObjects[x][y].delete(object);
      this.allObjects[x][y].add(object);
    } catch (e) {
    }
  }

  getPositionCell({ x, y }: Coords) {
    return this.allObjects[x][y];
  }

  getAtPosition({ x: objX, y: objY }: Coords) {
    const { x, y } = this.getPosition({ x: objX, y: objY });

    return this.getPositionCell({ x, y });
  }

  getPosition({ x: objX, y: objY }: Coords) {
    const x = Math.round(objX / CHUNK_SIZE);
    const y = Math.round(objY / CHUNK_SIZE);

    return { x, y };
  }

  getPositionRows() {
    return this.allObjects.length;
  }

  getPositionCols() {
    return this.allObjects[0].length;
  }
}

export default Scene;
