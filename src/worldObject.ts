import { Sprite } from "pixi.js";
import Movement from "./behavior/movement";
import { Coords } from "./organisms/autotroph";
import Organism from "./organisms/organism";
import Scene from "./scene";
import TextureOrganism from "./textureOrganism";
import Physics, { ICollidableObject } from "./utils/physics/physics";

export type WorldObjectProps = {
  scene: Scene;
  shape: TextureOrganism;
  color?: number;
}

class WorldObject implements ICollidableObject {
  scene: Scene;
  color?: number;
  shape: TextureOrganism;
  x: number = 0;
  y: number = 0;
  otherShapes: Sprite[];
  defaultColor: number | undefined;

  constructor({ shape, scene }: WorldObjectProps) {
    this.scene = scene;
    this.shape = shape;
    this.otherShapes = [];

    const { x, y } = this.shape.getPosition();

    this.setPosition({ x, y });

    Physics.scene!.addObject(this);
  }

  setPosition({ x, y }: { x: number, y: number }) {
    const { scene } = this.shape;
    const { width: sceneWidth, height: sceneHeight } = scene.getDimensions();

    let newX = x;
    let newY = y;

    if (newX > sceneWidth) {
      newX = 0;
    }

    if (newY > sceneHeight) {
      newY = 0;
    }

    if (newX < 0) {
      newX = sceneWidth;
    }

    if (newY < 0) {
      newY = sceneHeight;
    }

    Physics.scene!.removeObject(this);
    this.shape.shape.position.x = newX;
    this.shape.shape.position.y = newY;

    const { x: sceneX, y: sceneY } = Physics.scene!.addObject(this);

    this.shape.shape.position.x = sceneX;
    this.shape.shape.position.y = sceneY;
  }

  canEat(organism: Organism) {
    return false;
  }

  getPosition() {
    return this.shape.getPosition();
  }

  getAbsolutePosition() {
    return this.shape.getGlobalPosition();
  }

  getDimensions() {
    const { width, height } = this.shape.getDimensions();

    return { width, height };
  }

  onHover() { }

  die() {
    this.remove();
  }

  remove() {
    this.otherShapes.forEach(shape => Physics.scene!.container.removeChild(shape));
  }
}

export default WorldObject;
