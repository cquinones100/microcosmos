import Behavior, { BehaviorProps } from "../behavior";
import Organism from "../organisms/organism";
import WorldObject from "../worldObject";

class Detection extends Behavior {
  detections: Organism[];
  radius: number;
  onDetect: (obj: WorldObject, cancel: () => void) => void;

  constructor(args?: BehaviorProps) {
    super(args);

    this.detections = [];

    this.radius = 5;
    this.onDetect = () => {};
  }

  call({ organism }: { organism: Organism }): void {
    const call = () => {
      organism.scene.measure("For loop", () => {
        for (let obj of Array.from(organism.scene.organisms)) {
          if (obj === organism) continue;
          this.onDetect(obj, () => {});
        }
      })
    }

    call();
  }

  getOrganismRadius(organism: Organism) {
    return this.radius;
  }
}

export default Detection;
