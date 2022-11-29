import { BitmapFontData, DisplayObject, Graphics } from "pixi.js";
import { Coords } from "./organisms/autotroph";
import Scene from "./scene";
import TextureOrganism from "./textureOrganism";

export type WorldObjectProps = {
  scene: Scene;
  shape: TextureOrganism;
  color?: number;
}

class WorldObject {
  scene: Scene;
  color?: number;
  shape: TextureOrganism;

  public static screenBasedPosition({ x, y, scene }: { x: number; y: number; scene: Scene }) {
    const { width, height } = scene.app.screen;
    const newX = (width / 2 + x);
    const newY = (height / 2 + y);

    return { x: newX, y: newY };
  }

  constructor({ shape, scene, color }: WorldObjectProps) {
    this.scene = scene;
    this.shape = shape;
  }

  setPosition({ x, y }: { x: number, y: number }) {
    // const { x: thisX, y: thisY } = this.shape;
    // const { width: sceneWidth, height: sceneHeight } = this.scene.getBounds();
    // const { coordinates } = this.scene;

    // const withinBounds = (originalCoord: number, targetCoord: number, boundary: number) => {
    //   if (targetCoord < boundary / 2 * -1) {
    //     return targetCoord + boundary;
    //   } else if (targetCoord > boundary / 2) {
    //     return targetCoord - boundary;
    //   } else {
    //     return targetCoord;
    //   }
    // }

    // const newX = withinBounds(thisX!, x, sceneWidth);
    // const newY = withinBounds(thisY!, y, sceneHeight);

    // const intersectingObject = Array
    //   .from(this.scene.allObjects)
    //   .find(obj => {
    //     if (obj === this) return false;

    //     const { x, y } = WorldObject.screenBasedPosition({ x: newX, y: newY, scene: this.scene });

    //     return obj.intersects(x, y);
    //   });

    // const callback = () => {
    //   this.shape.x = newX;
    //   this.shape.y = newY;

    //   const prevAbsoluteX = sceneWidth / 2 + thisX!;
    //   const prevAbsoluteY = sceneHeight / 2 + thisY!;

    //   const absoluteX = (sceneWidth / 2 + this.shape.x);
    //   const absoluteY = (sceneHeight / 2 + this.shape.y);

    //   coordinates[absoluteX] ||= [];
    //   coordinates[absoluteX][absoluteY] ||= new Set<WorldObject>();

    //   if (coordinates[prevAbsoluteX]) {
    //     coordinates[prevAbsoluteX][prevAbsoluteY]?.delete(this);
    //   }

    //   this.scene.coordinates[absoluteX][absoluteY].add(this);
    // };

    // if (intersectingObject) {
    // this.onIntersection({ x: newX, y: newY }, intersectingObject, callback);
    // } else {
    const { width, height, scene } = this.shape
    this.shape.shape.position.x = x;
    this.shape.shape.position.y = y;

    if (this.shape.shape.position.x > scene.app.screen.width + width) {
      this.shape.shape.position.x -= scene.app.screen.width + width + width;
    }

    if (this.shape.shape.position.y > scene.app.screen.height + height) {
      this.shape.shape.position.y -= scene.app.screen.height + height + height;
    }
    // callback();
    // }
  }

  getPosition() {
    return this.shape.getPosition();
  }

  getAbsolutePosition() {
    return this.shape.getGlobalPosition();
  }

  getDimensions() {
    const { width, height } = this.shape;

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
