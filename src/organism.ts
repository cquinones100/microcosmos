import * as THREE from "three";
import Intersection from "./intersection";
import Scene from "./scene";

type OrganismShapeName = "square" | "triangle" | "sphere";

export type OrganismShape = THREE.Mesh<THREE.BoxGeometry | THREE.SphereGeometry, THREE.MeshBasicMaterial>;

class Organism {
  scene: Scene;
  shape: OrganismShape;
  xDirection: number;
  yDirection: number;
  speed: number;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  organismName: string;
  color: number[];

  constructor({
    shape,
    scene,
    organismName,
    speed,
    width,
    height,
    positionX,
    positionY
  }: {
    shape: OrganismShapeName,
    scene: Scene,
    organismName: string,
    speed: number,
    width: number,
    height: number,
    positionX: number,
    positionY: number
  }) {
    this.scene = scene;
    this.xDirection = speed;
    this.yDirection = speed;
    this.width = width;
    this.height = height;
    this.positionX = positionX;
    this.positionY = positionY;
    this.speed = speed;
    this.organismName = organismName;
    this.color = [Math.random(), Math.random(), Math.random()];

    switch (shape) {
      case "square":
        this.shape = this.getCube();
        break;
      case "sphere":
        this.shape = this.getSphere();
        break;
      default: {
        this.shape = this.getCube();
      }
    }
  }

  action() {
    this.scene.animate(this, function (organism: Organism, scene: Scene) {
      const intersection = scene.boundaries.map(boundary => new Intersection(organism, boundary))
        .find(intersection => intersection.collided());

      if (intersection) intersection.bounce();

      organism.shape.position.setX(organism.shape.position.x + organism.xDirection);
      organism.shape.position.setY(organism.shape.position.y + organism.yDirection);
    });
  }

  private getCube() {
    const geometry = new THREE.BoxGeometry(this.scene.size(this.width), this.scene.size(this.height), 1);

    return this.buildOrganism(geometry);
  }

  private getSphere() {
    const geometry = new THREE.SphereGeometry(this.scene.size(this.height), 64, 32);

    return this.buildOrganism(geometry);
  }

  private buildOrganism(geometry: THREE.BoxGeometry | THREE.SphereGeometry) {
    const [r, g, b] = this.color;
    const material = new THREE.MeshBasicMaterial( { color: new THREE.Color(r, g, b)  } );
    const shape = new THREE.Mesh(geometry, material);
    shape.position.setX(this.positionX);
    shape.position.setY(this.positionY);

    this.scene.add(shape);

    return shape;
  }
}

export default Organism;
