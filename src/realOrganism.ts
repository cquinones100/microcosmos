import { Graphics } from "pixi.js";
import Behavior from "./behavior";
import GeneticCode from "./geneticCode";
import Movement from "./movement";
import Autotroph from "./organisms/autotroph";
import Scene from "./scene";

export class Chemical {}

export type RealOrganismProps = {
  energySources?: (any)[];
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

  constructor({ energySources = [], geneticCode, scene, shape }: RealOrganismProps) {
    this.energySource = energySources;
    this.geneticCode = geneticCode;
    this.scene = scene
    this.shape = shape;
    this.behaviors = new Set<Behavior>();
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.color = 0xff0000;
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

  setPosition({ x, y }: { x: number, y: number }) {
    const { x: thisX, y: thisY } = this.getAbsolutePosition();
    const { width: sceneWidth, height: sceneHeight } = this.scene.getBounds();

    const withinBounds = (thisCoord: number, coord: number, boundary: number) => {
      if (coord + thisCoord < 0) {
        return coord + boundary;
      } else if (coord + thisCoord > sceneWidth) {
        return coord = boundary;
      } else {
        return coord;
      }
    }

    this.shape.position.x = withinBounds(thisX, x, sceneWidth);
    this.shape.position.y = withinBounds(thisY, y, sceneHeight);
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

  getDimensions() {
    const { width, height } = this.shape;

    return { width, height };
  }

  consume(organism: RealOrganism) {
    console.log('consumed!');
    this.scene.predators.add(this);
    this.scene.prey.add(organism);
    this.energy += organism.energy;

    organism.die();
  }

  duplicate() {
    const { x, y } = this.getAbsolutePosition();

    return this.scene.createOrganism({ x, y, });
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
