import Behavior from "../behavior";
import GeneticCode from "../geneticCode";
import WorldObject, { WorldObjectProps } from "../worldObject";

export type OrganismProps = {
  energySources?: (any)[];
  geneticCode?: GeneticCode;
  generation?: number;
  x?: number;
  y?: number;
} & WorldObjectProps;

class Organism extends WorldObject {
  energySource: OrganismProps["energySources"];
  geneticCode?: OrganismProps["geneticCode"];
  behaviors: Set<Behavior>;
  maxEnergy: number;
  energy: number;
  generation: number;
  color: number = 0xff0000;

  constructor({ energySources = [], geneticCode, generation, x, y, color, ...args }: OrganismProps) {
    super(args);

    this.energySource = energySources;
    this.geneticCode = geneticCode;
    this.behaviors = new Set<Behavior>();
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.generation = generation || 0;
    this.shape.beginFill(color || this.color);
  }

  animate() {
    if (this.energy <= 0) {
      this.scene.naturalDeaths.add(this);

      return;
    }

    this.geneticCode!.animate();

    this.behaviors.forEach(behavior => this.act(behavior));
  }

  setBehavior(behavior: Behavior) {
    this.behaviors.add(behavior);
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

  removeBehavior(behavior: Behavior) {
    this.behaviors.delete(behavior);
  }

  die() {
    this.scene.killOrganism(this);
  }

  disappear() {
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

  canEat(organism: Organism) {
    return organism.canBeEatenBy(this);
  }
  canBeEatenBy<Organism>(arg0: this) {
    return false;
  }

  setEnergy(value: number) {
    this.energy = Math.max(Math.min(this.maxEnergy, value), 0);
  }

  duplicate(): Organism {
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

  consume(organism: Organism) {}

  dead() {
    return this.energy <= 0;
  }
}

export default Organism;
