import Behavior from "./behavior";
import GeneticCode from "./geneticCode";
import Movement from "./movement";
import Autotroph, { Coords } from "./organisms/autotroph";
import WorldObject, { WorldObjectProps } from "./worldObject";

export type RealOrganismProps = {
  energySources?: (any)[];
  geneticCode?: GeneticCode;
}

class RealOrganism extends WorldObject {
  energySource: RealOrganismProps["energySources"];
  geneticCode?: RealOrganismProps["geneticCode"];
  movement?: Movement;
  behaviors: Set<Behavior>;
  maxEnergy: number;
  energy: number;

  constructor({ energySources = [], geneticCode, ...args }: RealOrganismProps & WorldObjectProps) {
    super(args);

    this.energySource = energySources;
    this.geneticCode = geneticCode;
    this.behaviors = new Set<Behavior>();
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
  }

  animate() {
    if (this.energy <= 0) {
      "died of starvation!"
      this.scene.naturalDeaths.add(this);
      return this.die();
    }

    this.geneticCode!.animate();

    this.behaviors.forEach(behavior => this.act(behavior));
  }

  resolveGeneticCode() {
    if (!this.geneticCode) return false;

    this.geneticCode.forEach(gene => {
      gene.resolve();
    });
  }

  resolveBehavior() {
    if (!this.geneticCode) return false;

    this.geneticCode.forEach(gene => {
      gene.animate();
    });
  }

  setBehavior(behavior: Behavior) {
    this.behaviors.add(behavior);
  }

  removeBehavior(behavior: Behavior) {
    this.behaviors.delete(behavior);
  }

  private die() {
    this.scene.remove(this);
    this.shape.destroy();
  }

  setSpeed(value: number) {
    const iterator = this.behaviors.values();

    let current = iterator.next().value;

    const isMovement = current instanceof Movement;

    while (current && !(isMovement)) {
      current = iterator.next().value;
    }

    if (current) current.speed = value;
  }

  act(behavior: Behavior) {
    this.energy -= behavior.getEnergy();

    behavior.call();
  }

  hungry() {
    return this.energy < this.maxEnergy;
  }

  consume(organism: RealOrganism) {
    console.log('consumed!');
    this.scene.predators.add(this);
    this.scene.prey.add(organism);
    this.energy += organism.energy;

    organism.die();
  }

  canBeEatenBy(organism: RealOrganism) {
    return false;
  }

  canEat(organism: RealOrganism | Autotroph) {
    return organism.energy > organism.maxEnergy * 0.75 && organism.canBeEatenBy(this);
  }

  setEnergy(value: number) {
    this.energy = Math.min(this.maxEnergy, value);
  }

  duplicate() {
    const { x, y } = this.getAbsolutePosition();

    return this.scene.createOrganism({ x, y, });
  }
}

export default RealOrganism;
