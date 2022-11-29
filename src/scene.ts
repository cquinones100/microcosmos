import * as PIXI from "pixi.js";
import RealOrganism from "./realOrganism";
import Stats from 'stats.js'
import WorldObject from "./worldObject";
import Organism from "./organisms/organism";
import { Application, Container } from "pixi.js";
import TextureOrganism from "./textureOrganism";
import TextureAutotroph from "./textureAutotroph";
import Autotroph from "./organisms/autotroph";

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
  container: PIXI.Container<PIXI.DisplayObject>;
  stop: boolean;

  constructor() {
    this.organisms = new Set<Organism>();
    this.allObjects = new Set();
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
      height: window.innerHeight,
      autoDensity: true,
      antialias: true,
      autoStart: false,
      backgroundColor: 0x333333,
      resolution: window.devicePixelRatio
    });
    this.center = { x: this.app.screen.width / 2, y: this.app.screen.height / 2 };
    this.stop = false;
    this.container.sortableChildren = true;
  }

  draw() {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const { app } = this;

    document.body.appendChild(app.view as unknown as Node);

    this.createOrganism();
    this.createAutotroph();
    this.createAutotroph();
    this.createAutotroph();
    this.createAutotroph();

    app.stage.addChild(this.container);

    document.addEventListener("keydown", ({ key }) => {
      if (key === ' ') {
        this.stop = !this.stop;

        console.log("Number of objects: ", this.allObjects.size);
        console.log("Number of Heterotrophs: ", Array.from(this.allObjects).filter(org => org instanceof RealOrganism).length);
        console.log(
          "Generations of Heterotrophs: ",
          (Array.from(this.allObjects) as RealOrganism[])
            .filter(org => org instanceof RealOrganism)
            .sort((a: RealOrganism, b: RealOrganism) => {
              if (a.generation < b.generation) {
                return - 1;
              }

              if (a.generation > b.generation) {
                return 1;
              }

              return 0;
            })[0].generation + 1
        );
        console.log("Number of Autotrophs: ", Array.from(this.allObjects).filter(org => org instanceof Autotroph).length);
        console.log(
          "Generations of Autotrophs: ",
          (Array.from(this.allObjects) as Autotroph[])
            .filter(org => org instanceof Autotroph)
            .sort((a: Autotroph, b: Autotroph) => {
              if (a.generation < b.generation) {
                return -1;
              }

              if (a.generation > b.generation) {
                return 1;
              }

              return 0;
            })[0].generation + 1
        );
      }
    })

    app.ticker.add((timePassed: number) => {
      stats.begin();

      if (!this.stop) {
        this.timePassed = timePassed;

        this.allObjects = this.organisms;

        this.organisms.forEach(organism => organism.animate());

      }
      app.render();
      stats.end();
    })

    app.ticker.start();
  }

  createOrganism(
    { x, y, color }
    : { x?: number, y?: number, color?: number }
    = {}
  ) {
    const texture = TextureOrganism.create({ scene: this, x: Math.random() * this.app.screen.width, y: Math.random() * this.app.screen.height })

    const organism = RealOrganism.create({ texture, scene: this })

    this.organisms.add(organism);

    return organism;
  }

  createAutotroph() {
    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    const texture = TextureAutotroph.create({ scene: this, x: Math.random() * this.app.screen.width, y: Math.random() * this.app.screen.height })

    const organism = Autotroph.create({ texture, scene: this })

    this.organisms.add(organism);

    return organism;
  }

  add(organism: Organism) {
    this.organisms.add(organism);
    this.allObjects.add(organism);
  }

  killOrganism(organism: Organism) {
    this.organisms.delete(organism);
  }

  remove(organism: Organism) {
    organism.shape.shape.destroy()
    this.allObjects.delete(organism);
    this.organisms.delete(organism);
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

  getDimensions() {
    return { width: this.app.screen.width, height: this.app.screen.width };
  }
}

export default Scene;
