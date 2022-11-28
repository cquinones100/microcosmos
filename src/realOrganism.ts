import Behavior from "./behavior";
import GeneticCode from "./geneticCode";
import Autotroph, { Coords } from "./organisms/autotroph";
import WorldObject, { WorldObjectProps } from "./worldObject";

export type RealOrganismProps = {
  energySources?: (any)[];
  geneticCode?: GeneticCode;
  generation?: number;
}

class RealOrganism extends WorldObject {
  energySource: RealOrganismProps["energySources"];
  geneticCode?: RealOrganismProps["geneticCode"];
  behaviors: Set<Behavior>;
  maxEnergy: number;
  energy: number;
  generation: number;

  constructor({ energySources = [], geneticCode, generation, ...args }: RealOrganismProps & WorldObjectProps) {
    super(args);

    this.energySource = energySources;
    this.geneticCode = geneticCode;
    this.behaviors = new Set<Behavior>();
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.generation = generation || 0;
  }

  animate() {
    if (this.energy <= 0) {
      "died of starvation!"
      this.scene.naturalDeaths.add(this);
      return;
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
    this.scene.killOrganism(this);
  }

  private disappear() {
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

  canEat(organism: RealOrganism | Autotroph) {
    return organism.canBeEatenBy(this);
  }

  setEnergy(value: number) {
    this.energy = Math.max(Math.min(this.maxEnergy, value), 0);
  }

  duplicate() {
    const { x, y } = this.getAbsolutePosition();
    const { width: sceneWidth, height: sceneHeight } = this.scene.getBounds();

    const organism = this.scene.createOrganism({ x: sceneWidth / 2 - 10, y: sceneHeight / 2 + 10 });
    
    organism.setPosition({ x: x - 10, y: y + 10 });
    this.generation += 1;
    organism.generation = this.generation;

    return organism;
  }

  onHover() {
    console.log(this);
  }
}

export default RealOrganism;
