import Movement from "./behavior/movement";
import { Coords } from "./organisms/autotroph";
import Organism from "./organisms/organism";
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

    const intersectionObject = this.scene.measure('intersection loop', () => {
      return Array.from(this.scene.organisms).find((organism) => {
        return this.intersectsObject(organism) && !this.canEat(organism);
      });
    })

    if (intersectionObject && this instanceof Organism) {
      const { xDirection, yDirection } = Movement.reverse(this);

      this.shape.shape.position.x += (width * xDirection) / 3;
      this.shape.shape.position.y += (height * yDirection) / 3;
    } else {
      this.shape.shape.position.x = newX
      this.shape.shape.position.y = newY
    }

    this.scene.setPosition({ x: thisX, y: thisY }, this);
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

  intersects(otherX: number, otherY: number) {
    const { x, y } = this.getPosition();
    const { width, height } = this.getDimensions();

    return otherX > x - width
      && otherX < x + width
      && otherY > y - width
      && otherY < y + height;
  }

  intersectsObject(obj: WorldObject) {
    if (obj === this) return;
    const { x, y } = obj.getPosition();

    return this.intersects(x, y);
  }

  screenBasedPosition() {
    return WorldObject
      .screenBasedPosition({ ...this.getAbsolutePosition(), scene: this.scene });
  }

  onIntersection({ x, y }: Coords, intersectionObject: WorldObject, cb: () => void) { }
}

export default WorldObject;
