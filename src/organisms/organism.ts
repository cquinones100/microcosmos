import { Text } from "pixi.js";
import Behavior, { IBehavior } from "../behavior";
import Movement from "../behavior/movement";
import Physics from "../utils/physics/physics";
import WorldObject, { IWorkerObject, WorldObjectProps } from "../worldObject";

export type OrganismProps = {
  energySources?: (any)[];
  generation?: number;
} & WorldObjectProps;

class Behaviors {
  array: IBehavior[];
  length: number;

  constructor () {
    this.array = [];
    this.length = 0;
  }

  push(...args: IBehavior[]) {
    this.array.push(...args);

    this.length = this.array.length;
  }

  find(cb: (behavior: IBehavior, index: number) => boolean) {
    return this.array.find(cb);
  }

  forEach(cb: (behavior: IBehavior, index: number) => void) {
    return this.array.forEach(cb);
  }

  filter(cb: (behavior: IBehavior, index: number) => boolean) {
    this.array = this.array.filter(cb);

    return this;
  }
}

class Organism extends WorldObject {
  public static color = 0xEFA8B1;

  energySource: OrganismProps["energySources"];
  behaviors: Behaviors;
  maxEnergy: number;
  energy: number;
  generation: number;
  color: number = Organism.color;
  text: Text;
  consumed: boolean;

  constructor({ energySources = [], generation, x, y, color, ...args }: OrganismProps) {
    super({ x, y, ...args });

    this.energySource = energySources;
    this.behaviors = new Behaviors();
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.generation = generation || 0;

    this.shape.shape.interactive = true
    this.shape.shape.on("click", () => {
      console.log(this);
      console.log("surrounded?", this.surrounded())
    });

    this.text = new Text("", {
      fill: "white",
      fontWeight: "bold",
      fontSize: 8
    });

    this.text.position.set(x, y);
    this.text.zIndex = 3;

    this.otherShapes.push(this.text);

    this.scene.container.addChild(this.text);
    this.consumed = false;
  }

  updateEnergyText() {
    this.text.text = `${Math.round(this.energy)} / ${this.maxEnergy}`;
  }

  animate() {
    if (this.energy <= 0) {
      this.die();

      return;
    }

    this.updateEnergyText();

    this.behaviors.forEach(behavior => this.act(behavior));
  }

  setBehavior(behavior: Behavior) {
    this.behaviors.push(behavior);
  }

  removeBehavior(behavior: Behavior) {
    this.behaviors = this.behaviors.filter(theBehavior => theBehavior !== behavior);
  }

  die() {
    super.die();

    Physics.scene!.organisms.delete(this);
  }

  disappear() {
    this.scene.remove(this);
  }

  act(behavior: Behavior) {
    this.energy -= behavior.energy;

    behavior.call();
  }

  hungry() {
    return this.energy < this.maxEnergy;
  }

  canEat(organism: Organism) {
    return this.scene.organisms.has(organism) && organism.canBeEatenBy(this);
  }

  canBeEatenBy<Organism>(arg0: this) {
    return true;
  }

  setEnergy(value: number) {
    this.energy = Math.max(Math.min(this.maxEnergy, value), 0);
  }

  duplicate(): Organism {
    return this.scene.createHeterotroph()
  }

  onHover() {
    console.log(this);
  }

  consume(organism: Organism) {}

  dead() {
    return this.energy <= 0;
  }

  setPosition({ x, y }: { x: number; y: number; }): void {
    this.x = x;
    this.y = y;
    super.setPosition({ x, y });

    this.text.position.set(x + 3, y + this.getDimensions().height / 2 - 3);
  }

  toWorkerObject(id?: number): IWorkerObject {
    return {
      id,
      position: this.getPosition(),
      dimensions: this.getDimensions(),
      hungry: this.hungry(),
    }
  }
}

export default Organism;
