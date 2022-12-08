import { DEFAULT_ENERGY, IBehavior } from "../behavior";
import { initializeDuplicateBehavior } from "../duplication";
import Organism from "../organisms/organism";
import { Coords } from "../physics/coordinates";
import Physics, { IVector } from "../utils/physics/physics";

class Movement implements IBehavior {
  vector: IVector | undefined;
  organism: Organism;
  speed: number;
  x: number;
  y: number;
  defaultSpeed: number;
  energy: number;

  public static for(organism: Organism) {
    let movement =
      organism.behaviors
      .find(behavior => behavior instanceof Movement) as Movement;

    if (!movement) {
      movement = new Movement(organism);

      organism.behaviors.push(movement);
    }

    return movement;
  }

  constructor(organism: Organism) {
    this.organism = organism;
    this.defaultSpeed = 500;
    this.speed = this.defaultSpeed;
    const { x, y } = Physics.randomLocation();

    this.x = x;
    this.y = y;
    this.vector = this.createVector();
    this.energy = DEFAULT_ENERGY;
  }

  duplicate(duplicateOrganism: Organism): Movement {
    return initializeDuplicateBehavior(
      this,
      new Movement(duplicateOrganism),
      duplicate => {
        duplicate.defaultSpeed = this.defaultSpeed;
        duplicate.speed = this.speed;
      }
    );
  };

  mutate() {
    this.defaultSpeed += Math.max(Physics.negatableRandom(0.5), 0);
    this.speed = this.defaultSpeed;
  }

  call() {
    const vector = this.createVector();
    
    const { x: nX, y: nY } = vector.normalized();
    const { x, y } = this.organism.getPosition();

    const speed = Physics.speed(this.speed);

    this.organism.setPosition({
      x: x + nX * speed,
      y: y + nY * speed,
    });
  }

  createVector() {
    const { x: targetX, y: targetY } = this;
    const { x, y } = this.organism.getPosition();

    return Physics.Vector.getVector({ x, y, targetX, targetY });
  }

  moveTo({ x, y, speed = this.speed }: Coords & { speed?: number }) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  stop() {
    this.speed = 0;
  }
}

export default Movement;
