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
    const { x: objX, y: objY } = organism.getAbsolutePosition();

    this.detections = organism.scene.allObjects.reduce((acc: RealOrganism[], curr: any) => {
      if (curr !== organism) {
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

    this.detections = this.detections.sort((a: RealOrganism, b: RealOrganism) => {
      const distanceArea = (x: number, y: number) => {
        return Math.abs(objX - x * objY * y)
      };

      const { x: aCurrX, y: aCurrY } = a.getAbsolutePosition();
      const { x: bCurrX, y: bCurrY } = b.getAbsolutePosition();

      if (distanceArea(aCurrX, aCurrY) < distanceArea(bCurrX, bCurrY)) {
        return -1;
      }

      if (distanceArea(aCurrX, aCurrY) > distanceArea(bCurrX, bCurrY)) {
        return 1;
      }

      return 0;
    });
  }

  getOrganismRadius(organism: RealOrganism) {
    return organism.getDimensions().width * this.radius;
  }
}

export default Detection;
