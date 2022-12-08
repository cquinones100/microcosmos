import { Sprite } from "pixi.js";
import Organism from "./organisms/organism";
import Texture from "./texture";
import Physics, { ICollidableObject } from "./utils/physics/physics";

export type WorldObjectProps = {
  shape: Texture;
  color?: number;
}

class WorldObject implements ICollidableObject {
  color?: number;
  shape: Texture;
  x: number = 0;
  y: number = 0;
  otherShapes: Sprite[];
  defaultColor: number | undefined;
  texture: Texture;

  constructor({ shape }: WorldObjectProps) {
    this.shape = shape;
    this.texture = this.shape;
    this.otherShapes = [];

    const { x, y } = this.shape.getPosition();

    this.setPosition({ x, y });

    Physics.scene!.addObject(this);
  }

  setPosition({ x, y }: { x: number, y: number }) {
    const { scene } = Physics;
    const { width: sceneWidth, height: sceneHeight } = scene!.getDimensions();

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
    this.shape.setPosition({ x: newX, y: newY });

    const { x: sceneX, y: sceneY } = Physics.scene!.addObject(this);

    this.shape.setPosition({ x: sceneX, y: sceneY });
    this.x = sceneX;
    this.y = sceneY;
  }

  canEat(organism: Organism) {
    return false;
  }

  getPosition() {
    return this.shape.getPosition();
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
