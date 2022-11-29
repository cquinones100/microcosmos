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
  public static color = 0xEFA8B1;

  energySource: OrganismProps["energySources"];
  geneticCode?: OrganismProps["geneticCode"];
  behaviors: Set<Behavior>;
  maxEnergy: number;
  energy: number;
  generation: number;
  color: number = Organism.color;

  constructor({ energySources = [], geneticCode, generation, x, y, color, ...args }: OrganismProps) {
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
      this.scene.naturalDeaths.add(this);
      this.die();

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
    // this.shape.clear()
    // this.shape.beginFill(0x663633);
    // this.shape.drawCircle(this.scene.center.x, this.scene.center.y, 10);
    // this.shape.endFill;
  }

  disappear() {
    this.scene.remove(this);
    // this.shape.destroy();
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
    return this;
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
