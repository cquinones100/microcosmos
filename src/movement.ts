import Behavior from "./behavior";
import RealOrganism from "./realOrganism";

const DEFAULT_SPEED = 1;

type MovementProps = {
  obj: RealOrganism,
  speed?: number,
  xDirection?: 1 | 0 | -1,
  yDirection?: 1 | 0 | -1
}

class Movement implements Behavior {
  public static DEFAULT_SPEED = DEFAULT_SPEED;

  obj?: RealOrganism;
  speed: number;
  xDirection: number;
  yDirection: number;

  constructor({ obj, speed = DEFAULT_SPEED, xDirection = 0, yDirection = 0 }: MovementProps) {
    this.obj = obj;
    this.speed = speed;
    this.xDirection = xDirection;
    this.yDirection = yDirection;
  }

  call({ x: explicitX = null, y: explicitY = null } = {}): void {
    if (!this.obj) return;

    const { x: objX, y: objY } = this.obj.getPosition();

    const x = 
      explicitX !== null ? explicitX : objX + this.xDirection * this.speed

    const y = 
      explicitY !== null ? explicitY : objY + this.yDirection * this.speed

    this.obj.setPosition({ x, y });
  }

  duplicate(organism: RealOrganism) {
    const { speed } = this;

    return new Movement({ obj: organism, speed });
  }
}

export default Movement;
