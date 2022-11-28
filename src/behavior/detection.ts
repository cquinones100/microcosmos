import Behavior, { BehaviorProps } from "../behavior";
import RealOrganism from "../realOrganism";
import WorldObject from "../worldObject";

class Detection extends Behavior {
  detections: RealOrganism[];
  radius: number;
  onDetect: (obj: WorldObject, breakDetection: () => void) => void;

  constructor(args?: BehaviorProps) {
    super(args);

    this.detections = [];

    this.radius = 2;
    this.onDetect = () => {};
  }

  call({ organism }: { organism: RealOrganism }): void {
    const call = () => {
      const { x: orgX, y: orgY } = organism.getAbsolutePosition();
      const { width: sceneWidth, height: sceneHeight } = organism.scene.getBounds();

      const absoluteX = (sceneWidth / 2 + orgX);
      const absoluteY = (sceneHeight / 2 + orgY);

      const radius = this.getOrganismRadius(organism);

      const startX = absoluteX - radius;
      const endX = absoluteX + radius;
      const startY = absoluteY - radius;
      const endY = absoluteY + radius;

      for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
          const objs = organism.scene.coordinates[x]?.[y];

          if (objs) {
            objs.forEach(org => {
              this.onDetect(org, () => {});
            });
          }
        }
      }
    }

    organism.scene.measure('detect', call);
  }

  getOrganismRadius(organism: RealOrganism) {
    return organism.getDimensions().width * this.radius;
  }
}

export default Detection;
