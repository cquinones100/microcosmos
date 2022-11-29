import { Coords } from "./organisms/autotroph";
import Scene from "./scene";
import TextureOrganism from "./textureOrganism";

export type WorldObjectProps = {
  scene: Scene;
  shape: TextureOrganism;
  color?: number;
  x: number;
  y: number;
}

class WorldObject {
  scene: Scene;
  color?: number;
  shape: TextureOrganism;
  x: number = 0;
  y: number = 0;

  public static screenBasedPosition({ x, y, scene }: { x: number; y: number; scene: Scene }) {
    const { width, height } = scene.app.screen;
    const newX = (width / 2 + x);
    const newY = (height / 2 + y);

    return { x: newX, y: newY };
  }

  constructor({ shape, scene, color, x, y }: WorldObjectProps) {
    this.scene = scene;
    this.shape = shape;
  }

  setPosition({ x, y }: { x: number, y: number }) {
    const { x: thisX, y: thisY } = this.getPosition();
    const { scene } = this.shape;
    const { width, height } = this.shape.getDimensions();
    const { width: sceneWidth, height: sceneHeight } = scene.getDimensions();

    const intersectingObject = Array
      .from(this.scene.allObjects)
      .find(obj => {
        if (obj === this) return false;

        return obj.intersects(thisX!, thisY!);
      });

    this.shape.shape.position.x = x;
    this.shape.shape.position.y = y;

    if (this.shape.shape.position.x > sceneWidth) {
      this.shape.shape.position.x -= sceneWidth + width + width;
    }

    if (this.shape.shape.position.y > sceneHeight) {
      this.shape.shape.position.y -= sceneHeight + height + height;
    }
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

  intersects(otherX: number, otherY: number) {
    const { x, y } = this.screenBasedPosition();
    const { width, height } = this.getDimensions();

    return otherX > x - width
      && otherX < x + width
      && otherY > y - height
      && otherY < y + height;
  }

  intersectsObject(obj: WorldObject) {
    if (obj === this) return;
    const { x, y } = obj.screenBasedPosition();

    return this.intersects(x, y);
  }

  screenBasedPosition() {
    return WorldObject
      .screenBasedPosition({ ...this.getAbsolutePosition(), scene: this.scene });
  }

  onIntersection({ x, y }: Coords, intersectionObject: WorldObject, cb: () => void) { }
}

export default WorldObject;
