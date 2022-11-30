import Behavior, { BehaviorProps } from "../behavior";
import { Coords } from "../organisms/autotroph";
import HeteroTroph from "../organisms/heterotroph";
import Organism from "../organisms/organism";
import Scene from "../scene";
import Physics, { IDirected } from "../utils/physics/physics";

const DEFAULT_SPEED = 5;

export type Direction = {
  xDirection: number,
  yDirection: number,
}

type MovementProps = {
  speed?: number,
  defaultSpeed?: number,
  energy?: number,
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
    const xVelocity = (speed * xDirection)
    const yVelocity = (speed * yDirection)

    const x = objX + xVelocity * scene.timePassed;
    const y = objY + yVelocity * scene.timePassed;

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

  constructor(args?: BehaviorProps & MovementProps) {
    const { speed, defaultSpeed, xDirection, yDirection, ...superArgs } = args || {};

    super(superArgs);

    this.defaultSpeed = speed || DEFAULT_SPEED;
    this.speed = speed || this.defaultSpeed;
    this.xDirection = xDirection || 0;
    this.yDirection = yDirection || 0;
    this.energy = 0.05
  }

  call({ organism }: { organism: Organism }): void {
    if (this.speed > 0) {
      Physics.Collision.update(organism, Movement.for(organism))
        .onClear(() => { this.move({ organism }) })
        .onCollision(Physics.avoid);
    }
  }

  move({ organism }: { organism : Organism }): void {
    const { x: objX, y: objY } = organism.getPosition();
    const { xDirection, yDirection } = this.getDirection();
    const { speed } = this;
    const { scene } = organism;

    const coordinates = Movement.calculatedCoordinate({
      x: objX,
      y: objY,
      xDirection,
      yDirection,
      speed,
      scene
    })

    organism.setPosition(coordinates);
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

  directTo({ organism, x, y }: { organism: HeteroTroph, x: number, y: number }) {
    const { x: objX, y: objY } = organism.getPosition();

    const dx = objX - x;
    const dy = objY - y;

    const normalizedValue = (delta: number) => {
      if (delta === 0) return 0;

      if (delta > 0) {
        return -1;
      } else {
        return 1;
      }
    }

    this.xDirection = normalizedValue(dx);
    this.yDirection = normalizedValue(dy);
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
