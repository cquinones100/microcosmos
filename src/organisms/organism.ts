import { Text } from "pixi.js";
import Behavior, { IBehavior } from "../behavior";
import Movement from "../behavior/movement";
import Physics from "../utils/physics/physics";
import WorldObject, { IWorkerObject, WorldObjectProps } from "../worldObject";

export type OrganismProps = {
  energySources?: (any)[];
  generation?: number;
} & WorldObjectProps;

class Organism extends WorldObject {
  public static color = 0xEFA8B1;

  energySource: OrganismProps["energySources"];
  behaviors: IBehavior[];
  maxEnergy: number;
  energy: number;
  generation: number;
  color: number = Organism.color;
  text: Text;
  consumed: boolean;

  constructor({ energySources = [], generation, x, y, color, ...args }: OrganismProps) {
    super({ x, y, ...args });

    this.energySource = energySources;
    this.behaviors = [];
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.generation = generation || 0;

    this.shape.shape.interactive = true
    this.shape.shape.on("click", () => {
      console.log(this);
    })

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

    this.behaviors = [];
  }

  updateEnergyText() {
    this.text.text = `${Math.round(this.energy)} / ${this.maxEnergy}`;
  }

  animate() {
    if (this.energy <= 0) {
      this.scene.naturalDeaths.add(this);
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

  movement() {
    return Array.from(this.behaviors).find((behavior) => behavior instanceof Movement) as Movement | undefined;
  }

  setPosition({ x, y }: { x: number; y: number; }): void {
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
