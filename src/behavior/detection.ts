import Behavior, { BehaviorProps } from "../behavior";
import RealOrganism from "../realOrganism";

class Detection extends Behavior {
  detections: RealOrganism[];
  radius: number;

  constructor(args?: BehaviorProps) {
    super(args);

    this.detections = [];

    this.radius = 20;
  }

  call({ organism }: { organism: RealOrganism }): void {
    this.detections = organism.scene.allObjects.reduce((acc: RealOrganism[], curr: any) => {
      if (curr !== organism) {
        const { x: objX, y: objY } = organism.getAbsolutePosition();
        const { x: currX, y: currY } = curr.getAbsolutePosition();

        const radius = this.getOrganismRadius(organism);

        if (currX >= objX - radius
          && currX <= objX + radius
          && currY >= objY - radius
          && currY <= objY + radius
        ) {
          acc.push(curr);
        }
      }

      return acc;
    }, []);
  }

  getOrganismRadius(organism: RealOrganism) {
    return organism.getDimensions().width * this.radius;
  }
}

export default Detection;
