import WorldObject, { IWorkerObject }  from "../../worldObject";
import { Coords } from "../../organisms/autotroph";
import Scene from "../../scene";

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
      collider: ICollisionObject,
      collided: ICollisionObject,
      directionHandler: IDirected
    )
    => void
  )
  => ICollisionHandler;
  onClear: (cb: () => void) => ICollisionHandler;
};

type ICollisionObject = IWorkerObject;
class Collision implements ICollisionHandler {
  private static grid: Set<ICollisionObject> = new Set();
  public static update(collider: ICollisionObject, directionHandler: IDirected): ICollisionHandler {

    const { grid } = Collision;

    grid.add(collider);

    const collisionObjects = Array.from(grid).filter(object => {
      const { x, y } = collider.position;
      const { x: objectX, y: objectY } = object.position;
      const { width, height } = collider.dimensions;

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

  public static collides(collider: ICollisionObject, collided: ICollisionObject): boolean {
      const { x, y } = collider.position;
      const { width, height } = collider.dimensions;
      const { x: collidedX, y: collidedY } = collided.position;

      return collided !== collider
        && collidedX > x - width
        && collidedX < x + width
        && collidedY > y - width
        && collidedY < y + height;
  }

  collided: ICollisionObject;
  collider: ICollisionObject;
  directionHandler: IDirected;
  clearCb?: () => void;
  collisionCb?: (collider: ICollisionObject, collided: ICollisionObject) => void;

  constructor(collider: ICollisionObject, collided: ICollisionObject, directionHandler: IDirected) {
    this.collider = collider;
    this.collided = collided;
    this.directionHandler = directionHandler;
    this.clearCb = () => {};
    this.collisionCb = undefined;
  }

  onClear(cb: () => void) {
    return this;
  }

  onCollision(cb: (collider: ICollisionObject, collided: ICollisionObject, directionHandler: IDirected) => void) {
    cb(this.collider, this.collided, this.directionHandler);

    return Collision.update(this.collider, this.directionHandler);
  }
}

class NoCollision implements ICollisionHandler {
  collider: ICollisionObject;
  collisionCb: () => void;
  clearCb?: () => void;
  directionHandler: IDirected;

  constructor(collider: ICollisionObject, directionHandler: IDirected) {
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
  obj: ICollisionObject;

  constructor({ obj }: { obj: ICollisionObject }) {
    this.obj = obj;
  }
}

type VectorProps = { x: number; y: number; targetX: number; targetY: number; }

export interface IVector {
  readonly x: number;
  readonly y: number;
  readonly length: number;
  readonly targetX: number;
  readonly targetY: number;
  normalized: () => Coords;
}

type Physics = {
  Movement: typeof Movement;
  Collision: typeof Collision;
  avoid: typeof avoid;
  Vector: {
    getVector: (args: VectorProps) => Vector;
  };
  randomLocation: () => Coords;
  setScene: (scene: Scene) => void;
  scene: Scene | undefined,
}

class Vector implements IVector {
  readonly x: number;
  readonly y: number;
  readonly length: number;
  readonly targetX: number;
  readonly targetY: number;
  originalX: number;
  originalY: number;

  constructor({ x, y, targetX, targetY }: VectorProps ) {
    this.originalX = x;
    this.originalY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.x = targetX - x;
    this.y = targetY - y;
    this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  divide() {
    return {
    }
  }

  normalized() {
    return {
      x: this.x / this.length,
      y: this.y / this.length,
    }
  }
}

const Physics: Physics = {
  Movement,
  Collision,
  avoid,
  Vector: {
    getVector(args: VectorProps) {
      return new Vector(args);
    },
  },
  randomLocation() {
    if (!this.scene) {
      throw new Error('Scene is not defined, make sure to set the scene with Physics#setScene');
    }

    const normalized = (value: number) => {
      return Math.max(Math.min(value));
    }

    return {
      x: normalized(Math.random() * this.scene.getDimensions().width - 10),
      y: normalized(Math.random() * this.scene.getDimensions().height - 10)
    }
  },
  setScene(scene: Scene) {
    this.scene = scene;
  },
  scene: undefined,
}

export default Physics;
