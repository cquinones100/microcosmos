import Behavior, { BehaviorProps } from "../behavior";
import { Coords } from "../organisms/autotroph";
import HeteroTroph from "../organisms/heterotroph";
import Organism from "../organisms/organism";
import Scene from "../scene";

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

class Movement extends Behavior {
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

  speed: number;
  defaultSpeed: number;
  xDirection!: MovementProps["xDirection"];
  yDirection!: MovementProps["yDirection"];

  constructor(args?: BehaviorProps & MovementProps) {
    const { speed, defaultSpeed, xDirection, yDirection, ...superArgs } = args || {};

    super(superArgs);

    this.defaultSpeed = speed || DEFAULT_SPEED;
    this.speed = speed || this.defaultSpeed;
    this.xDirection = xDirection || 0;
    this.yDirection = yDirection || 0;
  }

  call(
    { organism }:
    { organism: Organism }
  ): void {
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
}

export default Movement;
