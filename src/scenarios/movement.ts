import { IBehavior } from "../behavior";
import GeneticCode from "../geneticCode";
import { Coords } from "../organisms/autotroph";
import Organism from "../organisms/organism";
import Scene from "../scene";
import Physics, { IVector } from "../utils/physics/physics";
import Time from "../utils/time";

class NonOrganism {
  dimensions: { width: number, height: number };
  position: { x: number, y: number }

  constructor(organism: Organism) {
    this.dimensions = {
      width: 10,
      height: 10
    }

    this.position = Physics.randomLocation();
  }

  getPosition() {
    return this.position;
  }

  getDimension() {
    return this.dimensions;
  }

  setPosition(position: Coords) {
    this.position = position;
  }
}

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

  constructor(organism: Organism) {
    this.organism = organism;
    this.interval = 0;
    this.maxIntervals = 5;
  }

  call() {
    Time.track('call', this);

    Time.every('call', this, { seconds: 5 }, () => {
      if (this.interval * this.organism.scene.timePassed * 1000 > this.maxIntervals) {
        const movement = Movement.for(this.organism);

        movement.moveTo(Physics.randomLocation());

        this.interval = 0;
      }

      this.interval += 1;
    })
  }
}

class PersuesTarget implements IBehavior {
  target: Organism | NonOrganism | undefined;
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
      && Physics.Collision.collides(organism.toWorkerObject(), this.target.toWorkerObject());
  }

  call() {
    if (!this.target || this.target instanceof NonOrganism) {
      if (this.interval * this.organism.scene.timePassed > this.maxIntervals) {
        this.target = new NonOrganism(this.organism);
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

  organism.scenarioBehaviors.push(movement);

  movement.target = secondOrganism;

  secondOrganism.scenarioBehaviors.push(new PersuesTarget(secondOrganism));
};
