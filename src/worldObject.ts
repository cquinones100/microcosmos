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

    console.log("object coords: ", { x, y, thisX, thisY })

    this.shape.x = withinBounds(thisX, x, sceneWidth);
    this.shape.y = withinBounds(thisY, y, sceneHeight);
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
}

export default WorldObject;
