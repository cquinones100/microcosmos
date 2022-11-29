import { Circle } from "pixi.js";
import { Coords } from "./organisms/autotroph";
import Organism, { OrganismProps } from "./organisms/organism";

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
    const energyFromPrey = Math.min(this.maxEnergy - this.energy, organism.energy);

    organism.setEnergy(organism.energy - energyFromPrey);

    this.setEnergy(energyFromPrey);

    if (organism.energy <= 0) {
      organism.die();
      organism.disappear();
    }
  }

  canBeEatenBy(organism: RealOrganism) {
    return false;
  }

  onIntersection({ x, y }: Coords, callback: () => void): void {
    this.setPosition({ x: x - 10, y: y -10 });
  }
}

export default RealOrganism;
