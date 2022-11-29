import Behavior, { BehaviorProps } from "../behavior";
import RealOrganism from "../realOrganism";

const DEFAULT_SPEED = 5;

type MovementProps = {
  speed?: number,
  defaultSpeed?: number,
  xDirection?: number,
  yDirection?: number,
  energy?: number,
}

class Movement extends Behavior {
  public static randomDirectionValue() {
    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    return negatableRandom(1);
  }

  speed: number;
  defaultSpeed: number;
  xDirection: MovementProps["xDirection"];
  yDirection: MovementProps["yDirection"];

  constructor(args?: BehaviorProps & MovementProps) {
    const { speed, defaultSpeed, xDirection, yDirection, ...superArgs } = args || {};

    super(superArgs);

    this.defaultSpeed = speed || DEFAULT_SPEED;
    this.speed = speed || this.defaultSpeed;
    this.xDirection = xDirection || 0;
    this.yDirection = yDirection || 0;
  }

  call(
    { organism, x: explicitX, y: explicitY }:
    { organism: RealOrganism, x?: number, y?: number }
  ): void {
    const { x: objX, y: objY } = organism.getPosition();

    const { xDirection, yDirection } = this.getDirection();

    const xVelocity = (this.speed * xDirection)
    const yVelocity = (this.speed * yDirection)

    const x = objX + xVelocity * organism.scene.timePassed;
    const y = objY + yVelocity * organism.scene.timePassed;

    organism.setPosition({ x, y });
  }

  duplicate() {
    const { speed } = this;

    return new Movement({ speed });
  }

  getDirection() {
    const { xDirection, yDirection } = this;

    return {
      xDirection: xDirection!,
      yDirection: yDirection!
    }
  }

  directTo({ organism, x, y }: { organism: RealOrganism, x: number, y: number }) {
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
}

export default Movement;
