import { Graphics } from "pixi.js";
import Behavior from "./behavior";
import Gene from "./gene";
import GeneticCode from "./geneticCode";
import Movement from "./movement";
import NewOrganism from "./newOrganism";
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

  constructor({ energySources = [new Chemical()], geneticCode, scene, shape }: RealOrganismProps) {
    this.energySource = energySources;
    this.geneticCode = geneticCode;
    this.scene = scene
    this.shape = shape;
    this.behaviors = new Set<Behavior>();
  }

  animate() {
    if (!this.geneticCode) return false;

    this.geneticCode.animate();

    this.behaviors.forEach(behavior => behavior.call());
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
}

export default RealOrganism;
