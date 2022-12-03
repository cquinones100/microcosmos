import { IBehavior } from "../behavior";
import { Coords } from "../organisms/autotroph";
import Organism from "../organisms/organism";
import Physics, { IVector } from "../utils/physics/physics";

class Movement implements IBehavior {
  vector: IVector | undefined;
  organism: Organism;
  speed: number;
  x: number;
  y: number;
  defaultSpeed: number;

  public static for(organism: Organism) {
    let movement =
      organism.scenarioBehaviors
      .find(behavior => behavior instanceof Movement) as Movement;

    if (!movement) {
      movement = new Movement(organism);

      organism.scenarioBehaviors.push(movement);
    }

    return movement;
  }

  constructor(organism: Organism) {
    this.organism = organism;
    this.defaultSpeed = 1;
    this.speed = this.defaultSpeed;
    const { x, y } = Physics.randomLocation();

    this.x = x;
    this.y = y;
    this.vector = this.createVector();
  }

  call() {
    const vector = this.createVector();

    const { x: nX, y: nY } = vector.normalized();
    const { x, y } = this.organism.getPosition();

    this.organism.setPosition({
      x: x + nX * this.speed * this.organism.scene.timePassed,
      y: y + nY * this.speed * this.organism.scene.timePassed
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
