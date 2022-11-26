import { Graphics } from "pixi.js";
import Behavior from "./behavior";
import GeneticCode from "./geneticCode";
import Movement from "./movement";
import NewOrganism from "./newOrganism";
import Scene from "./scene";

export class Chemical {}

class Organic {}

export type RealOrganismProps = {
  energySources?: (Chemical | Organic)[];
  geneticCode: GeneticCode;
  scene: Scene;
  shape: Graphics;
}

class RealOrganism {
  energySource: RealOrganismProps["energySources"];
  geneticCode: RealOrganismProps["geneticCode"];
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
    console.log("animating");
    this.geneticCode.animate(this);

    this.behaviors.forEach(behavior => behavior.call());
  }

  resolveGeneticCode() {
    this.geneticCode.forEach(gene => {
      gene.resolve(this);
    });
  }

  resolveBehavior() {
    this.geneticCode.forEach(gene => {
      gene.animate(this);
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

  setBehavior(behavior: Behavior) {
    this.behaviors.add(behavior);
  }

  removeBehavior(behavior: Behavior) {
    this.behaviors.delete(behavior);
  }

  duplicate() {
    this.scene.createOrganism();
  }
}

export default RealOrganism;
