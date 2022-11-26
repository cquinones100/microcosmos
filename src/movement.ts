import Behavior, { BehaviorProps } from "./behavior";
import RealOrganism from "./realOrganism";

const DEFAULT_SPEED = 1;

type MovementProps = {
  obj: RealOrganism,
  speed?: number,
  defaultSpeed?: number,
  xDirection?: 1 | 0 | -1,
  yDirection?: 1 | 0 | -1,
  energy?: number,
}

class Movement extends Behavior {
  speed: number;
  defaultSpeed: number;
  xDirection: MovementProps["xDirection"];
  yDirection: MovementProps["yDirection"];

  constructor({
    speed = DEFAULT_SPEED,
    defaultSpeed = DEFAULT_SPEED,
    xDirection = 0,
    yDirection = 0,
    ...args
  }: BehaviorProps & MovementProps) {
    super(args);

    this.defaultSpeed = speed;
    this.speed = speed;
    this.xDirection = xDirection;
    this.yDirection = yDirection;
  }

  call({ x: explicitX, y: explicitY }: { x?: number, y?: number } = {}): void {
    if (!this.obj) return;

    const { x: objX, y: objY } = this.obj.getPosition();

    const { xDirection, yDirection } = this.getDirection();

    const x = 
      explicitX !== undefined ? explicitX : objX + xDirection * this.speed;

    const y = 
      explicitY !== undefined ? explicitY : objY + yDirection * this.speed;

    this.obj.setPosition({ x, y });
  }

  duplicate(organism: RealOrganism) {
    const { speed } = this;

    return new Movement({ obj: organism, speed });
  }

  getDirection() {
    const { xDirection, yDirection } = this;

    return {
      xDirection: xDirection!,
      yDirection: yDirection!
    }
  }
}

export default Movement;
