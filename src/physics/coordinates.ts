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

export class VirtualObject {
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
}

class Coordinates {
  public static coordinates: Set<ICoordinateObject>[][] = [];

  public static withinObject(object: ICoordinateObject, cb: (cell: Set<ICoordinateObject>) => void) {
    const { x: centerX, y: centerY } = this.snappedPosition(object);
    const { width, height } = object.getDimensions();

    for (let x = Math.floor(centerX - (width / 2)); x <= Math.floor(centerX + (width / 2)); x++) {
      for (let y = Math.floor(centerY - (height / 2)); y <= Math.floor(centerY + (height / 2)); y++) {
        this.coordinates[x] ||= [];
        this.coordinates[x][y] ||= new Set();

        cb(this.coordinates[x][y]);
      }
    }
  }

  public static snappedPosition(object: ICoordinateObject) {
    const { x, y } = object.getPosition();

    return { x: Math.floor(x), y: Math.floor(y) }
  }

  public static spaceLeft(originalObject: ICoordinateObject) {
    const { x: centerX, y: centerY } = this.snappedPosition(originalObject);
    const { width, height } = originalObject.getDimensions();

    const object = new VirtualObject({ x: centerX - (width * 1.5), y: centerY, width, height });

    // const texture = TextureAutotroph.create();
  }
}

export default Coordinates;
