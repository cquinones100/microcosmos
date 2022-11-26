import { Graphics } from "pixi.js";
import Behavior from "./behavior";
import Gene from "./gene";
import BounceOnCollisionGene from "./genes/bounceOnCollisionGene";
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
  energy: number;

  constructor({ energySources = [new Chemical()], geneticCode, scene, shape }: RealOrganismProps) {
    this.energySource = energySources;
    this.geneticCode = geneticCode;
    this.scene = scene
    this.shape = shape;
    this.behaviors = new Set<Behavior>();
    this.energy = 10;
  }

  animate() {
    if (!this.geneticCode) return;

    this.energy -= 0.1;

    if (this.energy <= 0) return this.die();

    this.geneticCode.animate();

    this.behaviors.forEach(behavior => behavior.call());

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
    this.geneticCode = undefined;
    this.shape.destroy();
    this.scene.remove(this);
  }

  handleIntersection(x?: number, y?: number) {
    const { x: thisX, y: thisY } = this.getAbsolutePosition();
    const { width, height } = this.shape;
    const { width: sceneWidth, height: sceneHeight } = this.scene.getBounds();

    if (thisX === undefined || thisY === undefined) return;

    const theX = (thisX || x);

    if ((x || thisX) <= 0) {
      const { x } = this.getPosition();

      this.shape.position.x = x + width;
    } else if ((y || thisY) <= 0) {
      const { y } = this.getPosition();

      this.shape.position.y = y + height;
    } else if ((x || thisX) >= sceneWidth) {
      const { x } = this.getPosition();

      this.shape.position.x = x - width;
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
}

export default RealOrganism;
