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
import { Application, Container, Graphics, Matrix, MSAA_QUALITY, Renderer, RenderTexture, Sprite, Text } from "pixi.js";
import TextureOrganism from "./textureOrganism";

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
    this.container = new Container();
  }

  draw() {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    const app = new Application({
      resizeTo: window,
      autoDensity: true,
      antialias: true,
      autoStart: false,
      backgroundColor: 0x333333,
      resolution: window.devicePixelRatio
    });
    document.body.appendChild(app.view as unknown as Node);

    const templateShape = new Graphics()
      .beginFill(0xffffff)
      .lineStyle({ width: 1, color: 0x333333, alignment: 0 })
      .drawCircle(0, 0, 20);

    const { width, height } = templateShape;

    // Draw the circle to the RenderTexture
    const renderTexture = RenderTexture.create({
      width,
      height,
      multisample: MSAA_QUALITY.HIGH,
      resolution: window.devicePixelRatio
    });

    // With the existing renderer, render texture
    // make sure to apply a transform Matrix
    app.renderer.render(templateShape, {
      renderTexture,
      transform: new Matrix(1, 0, 0, 1, width / 2, height / 2)
    });

    // Required for MSAA, WebGL 2 only
    (app.renderer as Renderer).framebuffer.blit();

    // Discard the original Graphics
    templateShape.destroy(true);

    const text = new Text("", {
      fill: "white",
      fontWeight: "bold",
      fontSize: 16
    });
    text.position.set(10);
    app.stage.addChild(text);

    this.createOrganism({ renderTexture, width, height });

    app.stage.addChild(this.container);

    this.container.interactive = true;
    this.container.on("click", () => {
      this.createOrganism({ renderTexture, height, width })
    });

    app.ticker.add((timePassed: number) => {
      stats.begin();
      this.timePassed = timePassed;

      this.organisms.forEach(organism => organism.animate());

      app.render();
      stats.end();
    })

    app.ticker.start();
  }

  createOrganism(
    { x, y, color, renderTexture, width, height }:
      { x?: number, y?: number, geneticCode?: GeneticCode, color?: number, renderTexture: RenderTexture, width: number, height: number }
  ) {
    const organism = new TextureOrganism({ renderTexture, scene: this, width, height });

    this.organisms.add(organism as unknown as Organism);

    return organism;
  }

  // createAutotroph({ x, y }: Partial<Coords> = {}) {
  //   const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

  //   const organism = new Autotroph({
  //     x: x || negatableRandom(100),
  //     y: y || negatableRandom(200),
  //     scene: this,
  //     shape: new PIXI.Graphics(),
  //   });

  //   organism.geneticCode = new GeneticCode([
  //     // new Reproduces(organism),
  //   ])

  //   this.add(organism);

  //   return organism;
  // }

  add(organism: Organism) {
    this.organisms.add(organism);
    // this.app.stage.addChild(organism.shape);
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
