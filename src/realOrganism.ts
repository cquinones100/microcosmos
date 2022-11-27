import Behavior from "./behavior";
import GeneticCode from "./geneticCode";
import Autotroph, { Coords } from "./organisms/autotroph";
import WorldObject, { WorldObjectProps } from "./worldObject";

export type RealOrganismProps = {
  energySources?: (any)[];
  geneticCode?: GeneticCode;
}

class RealOrganism extends WorldObject {
  energySource: RealOrganismProps["energySources"];
  geneticCode?: RealOrganismProps["geneticCode"];
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

  act(behavior: Behavior) {
    this.energy -= behavior.getEnergy();

    behavior.call({ organism: this });
  }

  hungry() {
    return this.energy < this.maxEnergy;
  }

  consume(organism: RealOrganism) {
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
}

export default RealOrganism;
