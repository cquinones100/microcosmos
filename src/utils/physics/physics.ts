import WorldObject from "../../worldObject";
import { Coords } from "../../organisms/autotroph";
import Scene from "../../scene";
import Organism from "../../organisms/organism";

export interface IDirected {
  xDirection: number;
  yDirection: number;
  speed: number;
  setDirection: ({ x, y, }: Coords) => void;
  randomDirectionValue: () => number;
}

export interface ICollidableObject {
  getPosition: () => Coords;
  getDimensions: () => { width: number; height: number };
  setPosition: (coords: Coords) => void;
  die: () => void;
}

export class Point implements ICollidableObject {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getPosition() {
    const { x, y } = this;

    return { x, y };
  }

  getDimensions() {
    return { width: 0, height: 0 };
  }

  setPosition({ x, y }: Coords) {
    this.x = x;
    this.y = y;
  }

  die() {}

  roundLeft() {
    this.x = Math.floor(this.x);
    this.y = Math.round(this.y)

    return this;
  }

  roundUp() {
    this.x = Math.round(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  roundRight() {
    this.x = Math.ceil(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  roundDown() {
    this.x = Math.round(this.x);
    this.y = Math.ceil(this.y);

    return this;
  }
}

class Collision {
  public static collides(collider: ICollidableObject, collided: ICollidableObject): boolean {
      const { x, y } = collider.getPosition();
      const { width, height } = collider.getDimensions();
      const { x: collidedX, y: collidedY } = collided.getPosition();

      return collided !== collider
        && collidedX > x - width
        && collidedX < x + width
        && collidedY > y - width
        && collidedY < y + height;
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

type VectorProps = { x: number; y: number; targetX: number; targetY: number; }

type Physics = {
  Collision: typeof Collision;
  avoid: typeof avoid;
  Vector: {
    getVector: (args: VectorProps) => Vector;
  };
  randomLocation: () => Coords;
  setScene: (scene: Scene) => void;
  scene: Scene | undefined,
  negatableRandom: (max: number) => number;
}

export interface IVector {
  readonly x: number;
  readonly y: number;
  targetX: number;
  targetY: number;
  normalized: () => Coords;
  getLength: () => number;
  getLengthSquared: () => number;
}

class Vector implements IVector {
  readonly x: number;
  readonly y: number;
  private length: number | undefined;
  readonly targetX: number;
  readonly targetY: number;
  originalX: number;
  originalY: number;
  private lengthSquared: number | undefined;

  constructor({ x, y, targetX, targetY }: VectorProps ) {
    this.originalX = x;
    this.originalY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.x = targetX - x;
    this.y = targetY - y;
  }

  normalized() {
    return {
      x: this.x / this.getLength(),
      y: this.y / this.getLength(),
    }
  }

  getLength() {
    this.length ||= Math.sqrt(this.x * this.x + this.y * this.y) 

    return this.length;
  }

  getLengthSquared() {
    this.lengthSquared ||= this.x * this.x + this.y * this.y

    return this.lengthSquared;
  }
}

const Physics: Physics = {
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
  negatableRandom: (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1,
}

export default Physics;
