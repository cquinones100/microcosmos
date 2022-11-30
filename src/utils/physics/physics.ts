import WorldObject from "../../worldObject";
import { Coords } from "../../organisms/autotroph";

export interface IDirected {
  xDirection: number;
  yDirection: number;
  speed: number;
  setDirection: ({ x, y, }: Coords) => void;
  randomDirectionValue: () => number;
}

type ICollisionHandler = {
  onCollision: (
    cb: (
      collider: WorldObject,
      collided: WorldObject,
      directionHandler: IDirected
    )
    => void
  )
  => ICollisionHandler;
  onClear: (cb: () => void) => ICollisionHandler;
};

class Collision implements ICollisionHandler {
  private static grid: Set<WorldObject> = new Set();
  public static update(collider: WorldObject, directionHandler: IDirected): ICollisionHandler {

    const { grid } = Collision;

    grid.add(collider);

    const collisionObjects = Array.from(grid).filter(object => {
      const { x, y } = collider.getPosition();
      const { x: objectX, y: objectY } = object.getPosition();
      const { width, height } = collider.getDimensions();

      return object !== collider
        && objectX > x - width
        && objectX < x + width
        && objectY > y - width
        && objectY < y + height;
    });

    if (collisionObjects.length > 0) {
      return new Collision(collider, collisionObjects[0], directionHandler);
    } else {
      return new NoCollision(collider, directionHandler);
    }
  }

  collided: WorldObject;
  collider: WorldObject;
  directionHandler: IDirected;
  clearCb?: () => void;
  collisionCb?: (collider: WorldObject, collided: WorldObject) => void;

  constructor(collider: WorldObject, collided: WorldObject, directionHandler: IDirected) {
    this.collider = collider;
    this.collided = collided;
    this.directionHandler = directionHandler;
    this.clearCb = () => {};
    this.collisionCb = undefined;
  }

  onClear(cb: () => void) {
    return this;
  }

  onCollision(cb: (collider: WorldObject, collided: WorldObject, directionHandler: IDirected) => void) {
    cb(this.collider, this.collided, this.directionHandler);

    return Collision.update(this.collider, this.directionHandler);
  }
}

class NoCollision implements ICollisionHandler {
  collider: WorldObject;
  collisionCb: () => void;
  clearCb?: () => void;
  directionHandler: IDirected;

  constructor(collider: WorldObject, directionHandler: IDirected) {
    this.collider = collider;
    this.collisionCb = () => {};
    this.clearCb = undefined;
    this.directionHandler = directionHandler;
  }

  onCollision() {
    return this;
  }

  onClear(cb: () => void) {
    cb()

    return Collision.update(this.collider, this.directionHandler);
  }
}

const avoid = (hugger: WorldObject, hugged: WorldObject, directionHandler: IDirected) => {
  const { x: huggerX, y: huggerY } = hugger.getPosition();
  const { width: huggerWidth, height: huggerHeight } = hugger.getDimensions();

  const { x: huggedX, y: huggedY } = hugged.getPosition();
  const { width: huggedWidth, height: huggedHeight } = hugged.getDimensions();

  const { speed, xDirection, yDirection } = directionHandler;

  let newX = huggerX;
  let newY = huggerY;

  if (huggerX < huggedX + huggedWidth || huggerX > huggedX) {
    newY = [huggedY - huggedHeight, huggedY + huggerHeight][Math.round(Math.random())];
  }

  if (huggerY < huggedY + huggedHeight || huggerY > huggedY) {
    newX = [huggedX - huggedWidth, huggedX + huggerWidth][Math.round(Math.random())];
  }

  const xVelocity = (speed * xDirection)
  const yVelocity = (speed * yDirection)

  const x = newX + xVelocity;
  const y = newY + yVelocity;

  hugger.setPosition({ x, y });
};

class Movement {
  // public static move({ obj }) {
    // (new Movement({ obj })).move();;
  // }

  obj: WorldObject;

  constructor({ obj }: { obj: WorldObject }) {
    this.obj = obj;
  }
}

const Physics = {
  Movement,
  Collision,
  avoid
}

export default Physics;
