import Behavior, { BehaviorProps } from "../behavior";
import { Coords } from "../organisms/autotroph";
import Organism from "../organisms/organism";
import Scene from "../scene";
import Physics, { IDirected, IVector } from "../utils/physics/physics";

const DEFAULT_SPEED = 5;

export type Direction = {
  xDirection: number,
  yDirection: number,
}

type MovementProps = {
  speed?: number;
  defaultSpeed?: number;
  energy?: number;
} & Partial<Direction>;

class Movement extends Behavior implements IDirected {
  public static randomDirectionValue() {
    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    return negatableRandom(1);
  }

  public static calculatedCoordinate(
    { x: objX, y: objY, xDirection, yDirection, speed, scene }
    : Direction & Coords & { speed: number, scene: Scene }
  ) {
    const xVelocity = (speed);
    const yVelocity = (speed);

    const vector = {x: (objX + xVelocity * scene.timePassed), y: (objY + yVelocity * scene.timePassed) }

    const x = objX + vector.x
    const y = objY + vector.y

    return { x, y };
  }

  public static randomize(organism: Organism) {
    let direction;

    organism.behaviors.forEach((behavior: Behavior) => {
      if (behavior instanceof Movement) {
        behavior.setDirection({ x: Movement.randomDirectionValue(), y: Movement.randomDirectionValue() });
        const { xDirection, yDirection } = behavior;

        direction = { xDirection, yDirection };
      }
    })

    return direction || { xDirection: 0, yDirection: 0 };
  }

  public static move(organism: Organism) {
    organism.behaviors.forEach((behavior: Behavior) => {
      if (behavior instanceof Movement) {
        behavior.move({ organism });
      }
    })
  }

  public static reverse(organism: Organism) {
    let direction;

    organism.behaviors.forEach((behavior: Behavior) => {
      if (behavior instanceof Movement) {
        const { xDirection: oldX, yDirection: oldY } = behavior;

        const xDirection = oldX! * -1;
        const yDirection = oldY! * -1;

        behavior.setDirection({ x: xDirection, y: yDirection });

        direction = { xDirection, yDirection };
      }
    })

    return direction || { xDirection: 0, yDirection: 0 };
  }

  speed: number;
  defaultSpeed: number;
  xDirection: IDirected["xDirection"];
  yDirection: IDirected["yDirection"];
  target: Coords;
  vector: IVector | undefined;

  constructor(args?: BehaviorProps & MovementProps) {
    const { speed, defaultSpeed, xDirection, yDirection, ...superArgs } = args || {};

    super(superArgs);

    this.defaultSpeed = speed || DEFAULT_SPEED;
    this.speed = speed || this.defaultSpeed;
    this.xDirection = xDirection || 0;
    this.yDirection = yDirection || 0;
    this.energy = 0.05
    this.target = { x: 0, y: 0 }
  }

  call({ organism }: { organism: Organism }): void {
    // if (this.speed > 0) {
    //   this.move({ organism })
    // }
  }

  move({ organism }: { organism : Organism }): void {
    const { x, y } = organism.getPosition();

    this.vector ||= Physics.Vector.getVector({
      x,
      y,
      targetX: this.target.x,
      targetY: this.target.y
    });

    const { x: nX, y: nY } = this.vector.normalized();

    organism.setPosition({
      x: x + nX * this.speed * organism.scene.timePassed,
      y: y + nY * this.speed * organism.scene.timePassed
    });
  }

  duplicate() {
    const { speed, defaultSpeed } = this;

    return new Movement({ speed, defaultSpeed });
  }

  getDirection() {
    const { xDirection, yDirection } = this;

    return {
      xDirection: xDirection!,
      yDirection: yDirection!
    }
  }

  setDirection({ x, y }: Partial<Coords>) {
    if (x !== undefined) {
      this.xDirection = x;
    }

    if (y !== undefined) {
      this.yDirection = y;
    }
  }

  directTo({ organism, x, y }: { organism: Organism, x: number, y: number }) {
    this.target = { x, y };
  }

  randomDirectionValue() {
    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    return negatableRandom(1) < 0 ? -1 : 1;
  }

  calculatedCoordinate(
    { x: objX, y: objY, xDirection, yDirection, speed, scene }
    : Direction & Coords & { speed: number, scene: Scene }
  ) {
    const xVelocity = (speed * xDirection)
    const yVelocity = (speed * yDirection)

    const x = objX + xVelocity * scene.timePassed;
    const y = objY + yVelocity * scene.timePassed;

    return { x, y };
  }
}

export default Movement;
