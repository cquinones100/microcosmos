import Behavior, { BehaviorProps } from "../behavior";
import Organism from "../organisms/organism";
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
      const { getPosition, getAtPosition, getPositionRows, getPositionCols  } = organism.scene;
      const { x: objX, y: objY } = organism.scene.getPosition(organism.getPosition());
      const radius = this.getOrganismRadius(organism);

      const numRows = getPositionRows.bind(organism.scene)();
      const numCols = getPositionCols.bind(organism.scene)();

      organism.scene.measure("For loop", () => {
        for (let x = Math.max(objX - radius, 0); x < Math.min(objX + radius, numRows); x++) {
          for (let y = Math.max(objY - radius, 0); y < Math.min(objY + radius, numCols); y++) {
            const set = organism.scene.getPositionCell({ x, y });

            if (set) {
              set.forEach(obj => {
                this.onDetect(obj);
              })
            }
          }
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
