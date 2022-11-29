import Behavior, { BehaviorProps } from "../behavior";
import Organism from "../realOrganism";
import WorldObject from "../worldObject";

class Detection extends Behavior {
  detections: Organism[];
  radius: number;
  onDetect: (obj: WorldObject) => void;

  constructor(args?: BehaviorProps) {
    super(args);

    this.detections = [];

    this.radius = 5;
    this.onDetect = () => {};
  }

  call({ organism }: { organism: Organism }): void {
    const call = () => {
      const { x: absoluteX, y: absoluteY } = organism.screenBasedPosition();
      const radius = this.getOrganismRadius(organism);

      const objs = Array.from(organism.scene.organisms).filter(org => {
        const { x: orgX, y: orgY } = org.screenBasedPosition();

        return org !== organism
          && orgX > absoluteX - radius
          && orgX < absoluteX + radius
          && orgY > absoluteY - radius
          && orgY < absoluteY + radius;
      });

      objs.forEach(this.onDetect);
    }

    organism.scene.measure('detection', call)
  }

  getOrganismRadius(organism: Organism) {
    return organism.getDimensions().width * this.radius;
  }
}

export default Detection;
