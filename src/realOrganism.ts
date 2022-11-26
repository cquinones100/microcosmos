import { Graphics } from "pixi.js";
import Behavior from "./behavior";
import GeneticCode from "./geneticCode";
import Movement from "./movement";
import Scene from "./scene";

export class Chemical {}

class Organic {}

export type RealOrganismProps = {
  energySources?: (Chemical | Organic)[];
  geneticCode?: GeneticCode;
  scene: Scene;
  shape: Graphics;
}

class RealOrganism {
  energySource: RealOrganismProps["energySources"];
  geneticCode?: RealOrganismProps["geneticCode"];
  scene: Scene;
  shape: RealOrganismProps["shape"];
  movement?: Movement;
  behaviors: Set<Behavior>;
  maxEnergy: number;
  energy: number;
  color: number;

  constructor({ energySources = [new Chemical()], geneticCode, scene, shape }: RealOrganismProps) {
    this.energySource = energySources;
    this.geneticCode = geneticCode;
    this.scene = scene
    this.shape = shape;
    this.behaviors = new Set<Behavior>();
    this.maxEnergy = 1000;
    this.energy = this.maxEnergy;
    this.color = 0xff0000;
  }

  animate() {
    if (this.energy <= 0) return this.die();

    this.geneticCode!.animate();

    this.behaviors.forEach(behavior => this.act(behavior));

    this.handleIntersection();
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

  setPosition({ x, y }: { x: number, y: number }) {
    this.shape.position.x = x;
    this.shape.position.y = y;
  }

  getPosition() {
    const { x, y } = this.shape.position;

    return { x,  y };
  }

  getAbsolutePosition() {
    const { x, y } = this.shape.getBounds();

    return { x,  y };
  }

  setBehavior(behavior: Behavior) {
    this.behaviors.add(behavior);
  }

  removeBehavior(behavior: Behavior) {
    this.behaviors.delete(behavior);
  }

  private die() {
    this.scene.remove(this);
    this.geneticCode = undefined;
    this.behaviors = new Set();
    this.shape.destroy();
  }

  handleIntersection(x?: number, y?: number) {
    const { x: thisX, y: thisY } = this.getAbsolutePosition();
    const { width, height } = this.shape;
    const { width: sceneWidth, height: sceneHeight } = this.scene.getBounds();

    if (thisX === undefined || thisY === undefined) return;

    if ((x || thisX) <= 0) {
      const { x } = this.getPosition();

      this.shape.position.x = x + width;
    } else if ((y || thisY) <= 0) {
      const { y } = this.getPosition();

      this.shape.position.y = y + height;
    } else if ((x || thisX) >= sceneWidth - width) {
      const { x } = this.getPosition();

      this.shape.position.x = sceneWidth - width;
    } else if ((y || thisY) >= sceneHeight) {
      const { y } = this.getPosition();

      this.shape.position.y = y - height;
    }
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

  getDimensions() {
    const { width, height } = this.shape;

    return { width, height };
  }

  consume(organism: RealOrganism) {
    console.log('consumed!');
    this.energy += organism.energy;

    organism.die();
  }
}

export default RealOrganism;
