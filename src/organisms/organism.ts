import { Text } from "pixi.js";
import Behavior, { IBehavior } from "../behavior";
import Physics from "../utils/physics/physics";
import WorldObject, { WorldObjectProps } from "../worldObject";

export type OrganismProps = {
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

  behaviors: Behaviors;
  maxEnergy: number;
  energy: number;
  generation: number;
  color: number = Organism.color;
  text: Text;
  consumed: boolean;

  constructor({ shape, generation, color, ...args }: OrganismProps) {
    super({ shape, ...args });

    this.behaviors = new Behaviors();
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.generation = generation || 0;

    this.text = new Text("", {
      fill: "white",
      fontWeight: "bold",
      fontSize: 8
    });

    this.setTextPosition();
    this.text.zIndex = 3;

    this.otherShapes.push(this.text);

    Physics.scene!.container.addChild(this.text);
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
    Physics.scene!.removeObject(this);
  }

  disappear() {
    Physics.scene!.remove(this);
  }

  act(behavior: Behavior) {
    this.energy -= behavior.energy;

    behavior.call();
  }

  hungry() {
    return this.energy < this.maxEnergy * 0.8;
  }

  canEat(organism: Organism) {
    return Physics.scene!.organisms.has(organism) && organism.canBeEatenBy(this);
  }

  canBeEatenBy<Organism>(arg0: this) {
    return true;
  }

  setEnergy(value: number) {
    this.energy = Math.max(Math.min(this.maxEnergy, value), 0);
  }

  duplicate(): Organism {
    return Physics.scene!.createHeterotroph()
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

    this.setTextPosition();
  }

  setTextPosition() {
    const { x, y } = this.getPosition();
    const { width, height } = this.getDimensions();

    this.text?.position.set(x - width / 2, y - height);
  }
}

export default Organism;
