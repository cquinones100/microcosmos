import { IBehavior } from "../behavior";
import GeneticCode from "../geneticCode";
import { Coords } from "../organisms/autotroph";
import Organism from "../organisms/organism";
import Scene from "../scene";
import Physics, { ICollidableObject, IVector, Point } from "../utils/physics/physics";

class Movement implements IBehavior {
  vector: IVector | undefined;
  organism: Organism;
  speed: number;
  x: number;
  y: number;

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
    this.speed = 1;
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
}

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

class PersuesTarget implements IBehavior {
  target: ICollidableObject | undefined;
  organism: Organism;
  interval: number;
  maxIntervals: number;
  speed: number;

  constructor (organism: Organism) {
    this.organism = organism;
    this.target = undefined;
    this.interval = 0;
    this.maxIntervals = 2;
    this.speed = 5;
  }

  collides() {
    const { organism } = this;

    return this.target 
      && this.target instanceof Organism
      && Physics.Collision.collides(organism, this.target);
  }

  call() {
    if (!this.target) {
      if (this.interval * this.organism.scene.timePassed > this.maxIntervals) {
        const { x, y } = Physics.randomLocation();

        this.target = new Point(x, y);
      }

      this.interval++;
    } else {
      this.interval = 0;

      if (this.collides()) {
        this.target.setPosition(Physics.randomLocation());
      }

      const { x, y } = this.target.getPosition();

      this.moveTo({ x, y });
    }
  }

  moveTo({ x, y }: Coords) {
    const movement = Movement.for(this.organism);

    const { speed } = this;

    movement.moveTo({ x, y, speed });
  }
}

export const create = (scene: Scene) => {
  const { width, height } = scene.getDimensions();

  const secondOrganism = scene.createHeterotroph({
    x: Math.random() * width - 60,
    y: Math.random() * height,
  });

  secondOrganism.shape.shape.tint = 0x1ECEE6;
  secondOrganism.geneticCode = new GeneticCode([]);
  secondOrganism.scenarioBehaviors.push(new MovesRandomly(secondOrganism));

  const organism = scene.createHeterotroph({ x: width / 2, y: height / 2 });
  const movement = new PersuesTarget(organism);
  movement.target = secondOrganism;
  organism.scenarioBehaviors.push(movement);
};
