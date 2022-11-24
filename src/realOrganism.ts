import Behavior from "./behavior";
import GeneticCode from "./geneticCode";
import Movement from "./movement";
import NewOrganism from "./newOrganism";
import Scene from "./scene";

export class Chemical {}

class Organic {}

type RealOrganismProps = {
  energySources: (Chemical | Organic)[];
  obj: NewOrganism;
  geneticCode: GeneticCode;
  scene: Scene;
}

class RealOrganism {
  energySource: RealOrganismProps["energySources"];
  obj: RealOrganismProps["obj"];
  geneticCode: RealOrganismProps["geneticCode"];
  scene: Scene;
  shape: THREE.Mesh<THREE.BoxGeometry | THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  width: number;
  height: number;
  movement?: Movement;
  behaviors: Set<Behavior>;

  constructor({ energySources, obj, geneticCode, scene }: RealOrganismProps) {
    this.energySource = energySources;
    this.obj = obj
    this.geneticCode = geneticCode;
    this.scene = scene
    this.shape = obj.shape;
    this.width = obj.width;
    this.height = obj.height;
    this.behaviors = new Set<Behavior>();
  }

  animate() {
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
}

export default RealOrganism;
