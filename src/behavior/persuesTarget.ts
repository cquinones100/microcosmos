import { DEFAULT_ENERGY, IBehavior } from "../behavior";
import { initializeDuplicateBehavior } from "../duplication";
import Organism from "../organisms/organism";
import { Coords } from "../physics/coordinates";
import Physics, { ICollidableObject } from "../utils/physics/physics";
import DetectsTarget from "./detectsTarget";
import Movement from "./movement";

class PersuesTarget implements IBehavior {
  target: ICollidableObject & Organism | undefined;
  organism: Organism;
  speed: number;
  detection: DetectsTarget | undefined;
  energy: number;
  private onCb: () => boolean;

  constructor (organism: Organism) {
    this.organism = organism;
    this.target = undefined;
    this.speed = 500;
    this.energy = DEFAULT_ENERGY;
    this.onCb = () => true;
  }

  on(onCb: () => boolean) {
    this.onCb = onCb;
  }

  duplicate(duplicateOrganism: Organism): PersuesTarget {
    const duplicate = initializeDuplicateBehavior(this, new PersuesTarget(duplicateOrganism));

    duplicate.speed = this.speed;

    return duplicate;
  }

  mutate() {
    this.speed += Math.max(Physics.negatableRandom(0.5), 0);
  }

  collides() {
    const { organism } = this;

    return this.target 
      && this.target instanceof Organism
      && Physics.Collision.collides(organism, this.target);
  }

  call() {
    if (!this.onCb()) return;
    if (this.target && this.organism.canEat(this.target)) {
      if (Physics.Collision.collides(this.organism, this.target)) {
        this.target = undefined;

        return;
      }

      if (this.detectedTarget() === this.target) {
        this.moveTo(this.target.getPosition());
      } else {
        this.target = this.detectedTarget();
      }
    } else {
      if (this.detectedTarget()) {
        this.target = this.detectedTarget();
      } else {
        // this.stop();
      }
    }
  }

  moveTo({ x, y }: Coords) {
    const movement = Movement.for(this.organism);

    const { speed } = this;

    movement.moveTo({ x, y, speed });
  }

  stop() {
    const movement = Movement.for(this.organism);
    
    movement.stop();
  }

  private getDetection() {
    return this.detection ||= DetectsTarget.for(this.organism);
  }

  private detectedTarget() {
    const detection = this.getDetection();

    const { x, y } = this.organism.getPosition();

    return Array.from(detection.targets).sort((a: ICollidableObject, b: ICollidableObject) => {
      const { x: targetAX, y: targetAY } = a.getPosition();
      const { x: targetBX, y: targetBY } = b.getPosition();

      const vectorA = Physics.Vector.getVector({ x, y, targetX: targetAX, targetY: targetAY });
      const vectorB = Physics.Vector.getVector({ x, y, targetX: targetBX, targetY: targetBY });

      if (vectorA.getLengthSquared() < vectorB.getLengthSquared()) {
        return - 1;
      } 

      if (vectorA.getLengthSquared() > vectorB.getLengthSquared()) {
        return 1;
      }

      return 0;
    }).filter(target => this.organism.canEat(target))[0];
  }
}

export default PersuesTarget;
