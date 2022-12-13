import { DEFAULT_ENERGY, IBehavior } from "../behavior";
import Organism from "../organisms/organism";
import Physics from "../utils/physics/physics";
import Movement from "./movement";
import { Point } from '../utils/physics/physics';
import { initializeDuplicateBehavior } from "../duplication";

class MovesRandomly implements IBehavior {
  organism: Organism;
  interval: number;
  maxIntervals: number;
  speed: number;
  energy: number;

  constructor(organism: Organism) {
    this.organism = organism;
    this.interval = 0;
    this.maxIntervals = 5000;
    this.speed = 500;
    this.energy = DEFAULT_ENERGY;

    const movement = Movement.for(this.organism);
    movement.speed = this.speed;

    this.move();
  }

  duplicate(duplicateOrganism: Organism): MovesRandomly {
    return initializeDuplicateBehavior(
      this,
      new MovesRandomly(duplicateOrganism),
      (duplicate) => {
        duplicate.speed = this.speed;
        duplicate.interval = this.interval;
        duplicate.maxIntervals = this.maxIntervals;
      });
  }

  mutate() {
    this.speed += Math.max(Physics.negatableRandom(0.5), 0);
  }

  call() {
    Physics.scene!.measure('moves randomly', () => {
      const movement = Movement.for(this.organism);

      if (
        this.interval > this.maxIntervals
        || Physics.Collision.collides(this.organism, new Point(movement.x, movement.y))
      ) {
        this.move();

        this.interval = 0;
      } else {
        this.interval += Physics.scene!.timePassed;
      }
    });
  }

  move() {
    const movement = Movement.for(this.organism);

    movement.moveTo({ ...Physics.randomLocation(), speed: this.speed });
  }
}

export default MovesRandomly;
