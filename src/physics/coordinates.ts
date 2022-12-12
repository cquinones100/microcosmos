import WorldObject from "../worldObject";

export type Coords = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
}

export interface ICoordinateObject {
  getPosition: () => Coords;
  getDimensions: () => Dimensions;
}

export class VirtualObject implements ICoordinateObject {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor({ x, y, width, height }: Coords & Dimensions ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getPosition() {
    const { x, y } = this;

    return { x, y };
  }

  getDimensions() {
    const { width, height } = this;

    return { width, height };
  }
}

class Coordinates {
  public static coordinates: Set<ICoordinateObject>[][] = [];

  public static withinObject(
    object: ICoordinateObject,
    cb: (cell: Set<ICoordinateObject>, x: number, y: number) => void
  ) {
    const { x: centerX, y: centerY } = this.snappedPosition(object);
    const { width, height } = object.getDimensions();

    for (let x = Math.floor(centerX - (width / 2)); x <= Math.floor(centerX + (width / 2)); x++) {
      for (let y = Math.floor(centerY - (height / 2)); y <= Math.floor(centerY + (height / 2)); y++) {
        this.coordinates[x] ||= [];
        this.coordinates[x][y] ||= new Set();

        cb(this.coordinates[x][y], x, y);
      }
    }
  }

  public static snappedPosition(object: ICoordinateObject) {
    const { x, y } = object.getPosition();

    return { x: Math.floor(x), y: Math.floor(y) }
  }

  public static canOccupy({ x, y, object }: Coords & { object: WorldObject }) {
    const { width, height } = object.getDimensions();

    const virtualObject = new VirtualObject({ x, y, width, height });

    let allFree = true;

    this.withinObject(virtualObject, (cell: Set<ICoordinateObject>, x: number, y: number) => {
      if (cell.size > 0) {
        allFree = false;
      }
    });

    return allFree;
  }

  public static withinRange(
    { x, y, width, height}: Coords & Dimensions,
    cb: (cell: Set<ICoordinateObject>, x: number, y: number) => void
  ) {
    const virtualObject = new VirtualObject({ x, y, width, height });

    this.withinObject(virtualObject, cb);
  }
}

export default Coordinates;
