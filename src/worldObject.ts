import { BitmapFontData, Graphics } from "pixi.js";
import { Coords } from "./organisms/autotroph";
import Scene from "./scene";

export type WorldObjectProps = {
  scene: Scene;
  shape: Graphics;
  color?: number;
}

class WorldObject {
  scene: Scene;
  shape: Graphics;
  color?: number;
  bounds: Coords;
  startingPosition: Coords;

  constructor({ shape, scene, color }: WorldObjectProps) {
    this.scene = scene;
    this.shape = shape;
    this.color = color || 0xff0000;
    this.bounds = this.shape.getBounds();
    this.startingPosition = this.shape.position;

    this.shape.on('mouseover', this.onHover.bind(this));
  }

  setPosition({ x, y }: { x: number, y: number }) {
    const { x: thisX, y: thisY } = this.shape;
    const { width: sceneWidth, height: sceneHeight } = this.scene.getBounds();

    const withinBounds = (originalCoord: number, targetCoord: number, boundary: number) => {
      if (targetCoord < boundary / 2 * -1) {
        return targetCoord + boundary;
      } else if (targetCoord > boundary / 2) {
        return targetCoord - boundary;
      } else {
        return targetCoord;
      }
    }

    this.shape.x = withinBounds(thisX, x, sceneWidth);
    this.shape.y = withinBounds(thisY, y, sceneHeight);

    const prevAbsoluteX = sceneWidth / 2 + thisX;
    const prevAbsoluteY = sceneHeight / 2 + thisY;

    const absoluteX = (sceneWidth / 2 + this.shape.x);
    const absoluteY = (sceneHeight / 2 + this.shape.y);

    this.scene.coordinates[absoluteX] ||= [];
    this.scene.coordinates[absoluteX][absoluteY] ||= new Set<WorldObject>();

    if (this.scene.coordinates[prevAbsoluteX]) {
      this.scene.coordinates[prevAbsoluteX][prevAbsoluteY]?.delete(this);
    }

    this.scene.coordinates[absoluteX][absoluteY].add(this);
  }

  getPosition() {
    return this.shape.position;
  }

  getAbsolutePosition() {
    return this.shape.getGlobalPosition();
  }

  getDimensions() {
    const { width, height } = this.shape;

    return { width, height };
  }

  onHover() {}

  intersects(otherX: number, otherY: number) {
    const { x, y } = this.screenBasedPosition();
    const { width, height } = this.getDimensions();

    return otherX > x - width
        && otherX < x + width
        && otherY > y - height
        && otherY < y + height;
  }

  screenBasedPosition() {
    const { width, height } = this.scene.app.screen;
    const { x: orgX, y: orgY } = this.getAbsolutePosition();
    const x = (width / 2 + orgX);
    const y = (height / 2 + orgY);

    return { x, y };
  }
}

export default WorldObject;
