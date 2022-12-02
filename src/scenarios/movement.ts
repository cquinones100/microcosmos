import { IBehavior } from "../behavior";
import Gene from "../gene";
import GeneticCode from "../geneticCode";
import { Coords } from "../organisms/autotroph";
import Organism from "../organisms/organism";
import Scene from "../scene";
import Physics from "../utils/physics/physics";

class NonOrganism {
  dimensions: { width: number, height: number };
  position: { x: number, y: number }

  constructor(organism: Organism) {
    this.dimensions = {
      width: 10,
      height: 10
    }

    const normalized = (value: number) => {
      return Math.max(Math.min(value));
    }

    const randomLocation = {
      x: normalized(Math.random() * organism.scene.app.screen.width - 10),
      y: normalized(Math.random() * organism.scene.app.screen.height - 10)
    }

    this.position = randomLocation;
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
  target: Organism | NonOrganism | undefined;
  speed: number;
  organism: Organism;
  interval: number;
  maxIntervals: number;

  constructor (organism: Organism) {
    this.organism = organism;
    this.target = undefined;
    this.speed = 10;
    this.interval = 0;
    this.maxIntervals = 2;
  }

  collides() {
    const { organism } = this;

    return this.target 
      && this.target instanceof Organism
      && Physics.Collision.collides(organism.toWorkerObject(), this.target.toWorkerObject());
  }

  call() {
    const { width, height } = this.organism.scene.getDimensions();
    const normalized = (value: number) => {
      return Math.max(Math.min(value));
    }

    const randomLocation = {
      x: normalized(Math.random() * width - this.organism.getDimensions().width),
      y: normalized(Math.random() * height - this.organism.getDimensions().height)
    }

    if (!this.target || this.target instanceof NonOrganism) {
      if (this.interval * this.organism.scene.timePassed > this.maxIntervals) {
        this.target = new NonOrganism(this.organism);
      }

      this.interval++;
    } else {
      this.interval = 0;

      if (this.collides()) {
        this.organism.setPosition(randomLocation);
        this.target.setPosition(randomLocation);
      }

      const { x, y } = this.target.getPosition();

      this.moveTo({ x, y });
    }
  }

  moveTo({ x: targetX, y: targetY }: Coords) {
    const { x, y } = this.organism.getPosition();

    const vector = Physics.Vector.getVector({
      x,
      y,
      targetX,
      targetY 
    });

    const { x: nX, y: nY } = vector.normalized();

    this.organism.setPosition({
      x: x + nX * this.speed * this.organism.scene.timePassed,
      y: y + nY * this.speed * this.organism.scene.timePassed
    });
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

  const organism = scene.createHeterotroph({ x: width / 2, y: height / 2 });
  const movement = new Movement(organism);

  organism.scenarioBehaviors.push(movement);

  movement.target = secondOrganism;

  secondOrganism.scenarioBehaviors.push(new Movement(secondOrganism));
};
