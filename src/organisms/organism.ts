import Behavior from "../behavior";
import GeneticCode from "../geneticCode";
import WorldObject, { WorldObjectProps } from "../worldObject";
import * as PIXI from "pixi.js";

export type OrganismProps = {
  energySources?: (any)[];
  geneticCode?: GeneticCode;
  generation?: number;
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
    super({ x, y, ...args });

    this.energySource = energySources;
    this.geneticCode = geneticCode;
    this.behaviors = new Set<Behavior>();
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.generation = generation || 0;

    this.shape.shape.interactive = true
    // this.shape.shape.hitArea = new PIXI.Rectangle(this.ge, 0, this.getDimensions().width, this.getDimensions().height);
    this.shape.shape.on("click", () => {
      console.log(this);
    })
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
    return this.scene.createOrganism()
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
