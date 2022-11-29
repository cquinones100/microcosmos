import { Circle } from "pixi.js";
import { Coords } from "./organisms/autotroph";
import Organism, { OrganismProps } from "./organisms/organism";
import WorldObject from "./worldObject";

class RealOrganism extends Organism {
  constructor({ x, y, ...args }: OrganismProps) {
    super(args);

    this.shape.drawCircle(this.scene.center.x, this.scene.center.y, 10);
    this.shape.interactive = true;
    this.shape.hitArea = new Circle(this.scene.center.x, this.scene.center.y, 10);

    if (x !== undefined && y !== undefined) {
      this.setPosition({ x, y });
    }
  }

  consume(organism: Organism) {
    this.scene.predators.add(this);
    this.scene.prey.add(organism);
    const energyFromPrey = 
      organism.dead()
      ? organism.maxEnergy * 0.1 
      : Math.min(this.maxEnergy - this.energy, organism.energy);

    organism.setEnergy(organism.energy - energyFromPrey);

    this.setEnergy(energyFromPrey);

    if (organism.energy <= 0) {
      organism.die();
      organism.disappear();
    }
  }

  canBeEatenBy(organism: RealOrganism) {
    return this.dead();
  }

  onIntersection({ x, y }: Coords, intersectionObject: WorldObject, ignoreIntersection: () => void): void {
    if (intersectionObject instanceof Organism && this.canEat(intersectionObject)) {
      ignoreIntersection();
    } else {
      const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

      this.setPosition({ x: x + negatableRandom(5), y: y + negatableRandom(5) });
    }
  }
}

export default RealOrganism;
