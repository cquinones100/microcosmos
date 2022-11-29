import { RenderTexture, Sprite } from "pixi.js"
import MovementGene from "./genes/movementGene";
import Reproduces from "./genes/reproduces";
import GeneticCode from "./geneticCode";
import { Coords } from "./organisms/autotroph";
import RealOrganism from "./realOrganism";
import Scene from "./scene";

type TextureOrganismProps = {
  renderTexture: RenderTexture;
  scene: Scene;
  width: number;
  height: number;
} & Partial<Coords>

class TextureOrganism {
  renderTexture: RenderTexture;
  shape: Sprite;
  speed: number;
  scene: Scene;
  width: number;
  height: number;
  organism: RealOrganism;
  x: number | undefined;
  y: number | undefined;

  constructor({ renderTexture, scene, x, y, width, height }: TextureOrganismProps) {
    this.shape = new Sprite(renderTexture);
    this.renderTexture = renderTexture;
    this.speed = 1;
    this.scene = scene;
    this.shape.position.x = x || this.scene.app.screen.width / 2;
    this.shape.position.y = y || this.scene.app.screen.height / 2;
    this.shape.tint = parseInt(Math.floor(Math.random() * 16777215).toString(16), 16);
    this.scene.container.addChild(this.shape);
    this.width = width;
    this.height = height;
    this.organism = new RealOrganism({ x, y, scene, shape: this });
    this.organism.geneticCode = new GeneticCode([
      new Reproduces(this.organism),
      new MovementGene(this.organism),
    ])
    this.x = this.shape.position.x;
    this.y = this.shape.position.y;
  }

  animate() {
    // const { shape, speed, scene, width, height } = this;
    // const { app } = scene;

    // shape.position.x += speed;
    // if (shape.position.x > app.screen.width + width) {
    //   shape.position.x -= app.screen.width + width + width;
    // }

    // if (shape.position.y > app.screen.height + height) {
    //   shape.position.y -= app.screen.height + height + height;
    // }

    // this.x = shape.position.x;
    // this.y = shape.position.y;
    this.organism.animate();
  }

  getPosition() {
    return this.shape.position;
  }

  getGlobalPosition() {
    return this.shape.getGlobalPosition();
  }
}

export default TextureOrganism;
