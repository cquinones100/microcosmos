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
      let cancel = false;

      const { getPositionRows, getPositionCols  } = organism.scene;
      const { x: objX, y: objY } = organism.scene.getPosition(organism.getPosition());
      const radius = this.getOrganismRadius(organism);

      const numRows = getPositionRows.bind(organism.scene)();
      const numCols = getPositionCols.bind(organism.scene)();

      organism.scene.measure("For loop", () => {
        for (let x = Math.max(objX - radius, 0); x < Math.min(objX + radius, numRows); x++) {
          if (cancel) break;
          for (let y = Math.max(objY - radius, 0); y < Math.min(objY + radius, numCols); y++) {
            if (cancel) break;

            let set: Set<WorldObject> | WorldObject[] = organism.scene.getPositionCell({ x, y });

            if (set) set = Array.from(set);

            if (set) {
              for (const obj of set) {
                if (cancel) break;

                this.onDetect(obj, () => { cancel = true });
              }
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
