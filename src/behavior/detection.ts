import Behavior, { BehaviorProps } from "../behavior";
import RealOrganism from "../realOrganism";

const DEFAULT_RADIUS = 10;

class Detection extends Behavior {
  detections: any[];
  radius: number;

  constructor(args: BehaviorProps) {
    super(args);

    this.detections = [];

    const { width } = this.obj.getDimensions();

    this.radius = width;
  }

  call<T extends {}>(args?: T | undefined): void {
    this.detections = this.obj.scene.allObjects.reduce((acc: any[], curr: any) => {
      if (curr !== this.obj) {
        const { x: objX, y: objY } = this.obj.getAbsolutePosition();
        const { x: currX, y: currY } = curr.getAbsolutePosition();

        if (currX >= objX - this.radius && currX <= objX + this.radius && currY >= objY - this.radius && currY <= objY + this.radius) {
          acc.push(curr);
        }
      }

      return acc;
    }, []);
  }

  duplicate(newOrganism: RealOrganism): Detection {
    return new Detection({ obj: newOrganism })
  }

  forEach(cb: (curr: any) => void) {
    this.detections.forEach(cb);

    this.call();
  }
}

export default Detection;