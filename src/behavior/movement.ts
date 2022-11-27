import Behavior, { BehaviorProps } from "../behavior";
import RealOrganism from "../realOrganism";

const DEFAULT_SPEED = 1;

type MovementProps = {
  speed?: number,
  defaultSpeed?: number,
  xDirection?: number,
  yDirection?: number,
  energy?: number,
}

class Movement extends Behavior {
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

    const x = 
      explicitX !== undefined ? explicitX : objX + xDirection * this.speed;

    const y = 
      explicitY !== undefined ? explicitY : objY + yDirection * this.speed;

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
    const { x: objX, y: objY } = organism.getAbsolutePosition();

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
