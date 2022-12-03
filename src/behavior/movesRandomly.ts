import { IBehavior } from "../behavior";
import Organism from "../organisms/organism";
import Physics from "../utils/physics/physics";
import Movement from "./movement";
import { Point } from '../utils/physics/physics';

class MovesRandomly implements IBehavior {
  organism: Organism;
  interval: number;
  maxIntervals: number;
  speed: number;

  constructor(organism: Organism) {
    this.organism = organism;
    this.interval = 0;
    this.maxIntervals = 5000;
    this.speed = 10;

    const movement = Movement.for(this.organism);
    movement.speed = this.speed;

    this.move();
  }

  call() {
    const movement = Movement.for(this.organism);

    if (
      this.interval > this.maxIntervals
      || Physics.Collision.collides(this.organism, new Point(movement.x, movement.y))
    ) {
      this.move();

      this.interval = 0;
    } else {
      this.interval += this.organism.scene.timePassedMS;
    }
  }

  move() {
    const movement = Movement.for(this.organism);

    movement.moveTo({ ...Physics.randomLocation(), speed: this.speed });
  }
}

export default MovesRandomly;
