import * as THREE from "three";
import GeneticCode from "./geneticCode";
import Scene from "./scene";

export type OrganismProps = {
  height: number;
  width: number;
  depth: number;
  x?: number;
  y?: number;
  color?: number[];
  scene: Scene;
  speed?: number;
  xDirection?: number;
  yDirection?: number;
  shapeType?: "square" | "sphere" | "other";
  geneticCode: GeneticCode;
}

class NewOrganism {
  height: number;
  width: number;
  depth: number;
  shape: THREE.Mesh<THREE.BoxGeometry | THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  x: number | undefined;
  y: number | undefined;
  color: number[];
  scene: Scene;
  xDirection: number;
  yDirection: number;
  geneticCode: GeneticCode;
  speed: number;

  constructor({
    height,
    width,
    depth,
    x,
    y,
    color,
    scene,
    speed = 1,
    xDirection = 0.01,
    yDirection = 0.01,
    shapeType = "square",
    geneticCode
  }: OrganismProps ) {
    this.height = height;
    this.width = width;
    this.depth = depth;
    this.x = x;
    this.y = y;
    this.color = [Math.random(), Math.random(), Math.random()];
    this.scene = scene;
    this.geneticCode = geneticCode;
    this.speed = speed;
    this.xDirection = xDirection * speed;
    this.yDirection = yDirection * speed;

    let geometry: THREE.BoxGeometry | THREE.SphereGeometry;

    if (shapeType === "square") {
      geometry = new THREE.BoxGeometry(height, width, depth);
    } else if (shapeType === "sphere") {
      geometry = new THREE.SphereGeometry(height, 64, 32);
    } else {
      const basis = Math.random() * height + width

      geometry = new THREE.SphereGeometry(height, basis * 2, basis);
    }

    const [r, g, b] = this.color;
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });
    this.shape = new THREE.Mesh(geometry, material);

    if (x) this.shape.position.x = x;
    if (y) this.shape.position.y = y;
  }

  move() {
    this.shape.position.x += this.xDirection;
    this.shape.position.y += this.yDirection;
  }
}

export default NewOrganism;