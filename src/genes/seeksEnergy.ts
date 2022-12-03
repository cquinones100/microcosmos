import Detection from "../behavior/detection";
import Gene from "../gene";
import Organism from "../organisms/organism";
// import { WorkerResolver } from "../utils/collisions.worker";
import Physics, { IVector } from "../utils/physics/physics";
import { IWorkerObject } from "../worldObject";
export const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

class SeeksEnergy extends Gene {
  detection: Detection;
  interval: number;
  target: Organism | undefined;
  targetPosition: { x: number; y: number; } | {};
  turns: number = 0;
  radius: number;
  vector: IVector | undefined;
  speed: number;

  constructor(args: Organism) {
    super(args);

    this.detection = new Detection();
    this.interval = 0;
    this.target = undefined;
    this.targetPosition = {};
    this.radius = 200;
    this.speed = 5;
  }

  animate() {
    this.organism.scene.measure('seeking energy', this.resolve.bind(this));
  }

  resolve() {
    // const movement = Movement.for<Movement>(this.organism);

    // if (this.target !== undefined) {
    //   if (!this.target!.canBeEatenBy(this.organism)) {
    //     this.target = undefined;
    //     this.vector = undefined;

    //     return this.detect();
    //   }

    //   if (Physics.Collision.collides(this.organism.toWorkerObject(), this.target.toWorkerObject())) {
    //     this.organism.consume(this.target)

    //     this.vector = undefined;
    //     return;
    //   }
    // }

    // this.detect();

    let lines = 25;
    const interval = 360 / 25;

    while (lines === 0) {
    }
  }

  detect() {
    const workerObjects: IWorkerObject[] = [];
    const organismMap: Organism[] = [];

    Array.from(this.organism.scene.organisms).forEach((org, id) => {
      if (org === this.organism) return this.organism.toWorkerObject(-1);

      const workerObject = org.toWorkerObject(organismMap.length);

      if (org.canBeEatenBy(this.organism)) {
        workerObject.canBeEaten = true;
      }

      const vector = Physics.Vector.getVector({
        x: this.organism.getPosition().x,
        y: this.organism.getPosition().y,
        targetX: workerObject.position.x,
        targetY: workerObject.position.y
      });

      if (vector.length < this.radius) {
        workerObjects.push(workerObject);

        organismMap.push(org);
      }
    });

    const organism = this.organism.toWorkerObject(-1);
    // const result = WorkerResolver.detect(organism, workerObjects, this.radius);

    // switch (result.action) {
    //   case 'MOVE':
    //     this.target = organismMap[result.params.id];

    //     this.move();

    //     break;
    //   case 'CONSUME':
    //     const target = organismMap[result.params.id];
    //     this.speed = 0;

    //     this.target = target;

    //     break;
    //   case 'BEGIN_MOVING':
    //     this.target = undefined;

    //     this.move();

    //     break;
    // }
  }

  move(): void {
    const { x, y } = this.organism.getPosition();

    this.vector ||= Physics.Vector.getVector({
      x,
      y,
      targetX: this.target?.getPosition()?.x || Math.random() * this.organism.scene.getBounds().width,
      targetY: this.target?.getPosition()?.y || Math.random() * this.organism.scene.getBounds().height
    });

    const { x: nX, y: nY } = this.vector.normalized();

    this.organism.setPosition({
      x: x + nX * this.speed * this.organism.scene.timePassed,
      y: y + nY * this.speed * this.organism.scene.timePassed
    });
  }

  increase() {}

  duplicate(newOrganism: Organism): Gene {
    return new SeeksEnergy(newOrganism);
  }

  mutate() {}
}

export default SeeksEnergy;
