import Detection from "../behavior/detection";
import Movement from "../behavior/movement";
import Gene from "../gene";
import Organism from "../organisms/organism";
import { WorkerResolver } from "../utils/collisions.worker";
import Physics from "../utils/physics/physics";
import { IWorkerObject } from "../worldObject";
export const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

class SeeksEnergy extends Gene {
  detection: Detection;
  interval: number;
  target: Organism | undefined;
  targetPosition: { x: number; y: number; } | {};
  turns: number = 0;
  radius: number;

  constructor(args: Organism) {
    super(args);

    this.detection = new Detection();
    this.interval = 0;
    this.target = undefined;
    this.targetPosition = {};
    this.radius = 200;
  }

  animate() {
    this.organism.scene.measure('seeking energy', this.resolve.bind(this));
  }

  resolve() {
    const movement = Movement.for<Movement>(this.organism);


    if (this.target !== undefined) {
      if (!this.target!.canBeEatenBy(this.organism)) {
        this.target = undefined;
      } else {
        const { x, y } = this.target.getPosition();

        if (Physics.Collision.collides(this.organism.toWorkerObject(), this.target.toWorkerObject())) {
          this.organism.consume(this.target)
          movement.speed = 0;
        } else {
          const { x: objX, y: objY } = this.organism.getPosition();

          movement.directTo({
            organism: this.organism,
            x,
            y
          });
        }
      }

      return;
    }

    if (this.target === undefined) {
      const workerObjects: IWorkerObject[] = [];
      const organismMap: Organism[] = [];

      Array.from(this.organism.scene.organisms).forEach((org, id) => {
        if (org === this.organism) return this.organism.toWorkerObject(-1);

        const { x, y } = org.getPosition();
        const { x: orgX, x: orgY } = this.organism.getPosition();

        const workerObject = org.toWorkerObject(organismMap.length);

        if (org.canBeEatenBy(this.organism)) {
          workerObject.canBeEaten = true;
        }

        // if (Math.abs(orgX) - Math.abs(x) < this.radius && Math.abs(orgY) - Math.abs(y) < this.radius) {
          workerObjects.push(workerObject);

          organismMap.push(org);
        // }
      });

      const organism = this.organism.toWorkerObject(-1);
      const result = WorkerResolver.detect(organism, workerObjects, this.radius);

      switch (result.action) {
        case 'MOVE':
          const { x, y } = result.params;

          movement.directTo({
            organism: this.organism,
            x,
            y
          });

          this.target = organismMap[result.params.id];
          this.targetPosition = { x, y }

          break;
        case 'SET_AS_FOOD':
          this.target = organismMap[result.params.id];

          break;
        case 'NULLIFY_TARGET':
          this.target = undefined;

          break;
        case 'CONSUME':
          const target = organismMap[result.params.id];
          movement.speed = 0;

          this.target = target;

          break;
        case 'BEGIN_MOVING':
          if (this.interval <= 0) {
            if (movement.speed === 0) movement.speed = movement.defaultSpeed;
            if (movement.xDirection === 0) movement.xDirection = negatableRandom(1);
            if (movement.yDirection === 0) movement.yDirection = negatableRandom(1);
          }

          break;
      }

    }
  }

  increase() {}

  duplicate(newOrganism: Organism): Gene {
    return new SeeksEnergy(newOrganism);
  }

  mutate() {}
}

export default SeeksEnergy;
