import * as THREE from "three";
import Scene from "./scene";

type OrganismShape = "square" | "triangle" | "circle";
export type Shape = THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>

class Organism {
  scene: Scene;
  shape: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;

  constructor(shape: OrganismShape, scene: Scene) {
    this.scene = scene;

    switch(shape) {
      case "square":
        this.shape = this.getCube();
      default: {
        this.shape = this.getCube();
      }
    }
  }

  getCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.scene.cameraPosition.z = 5;

    return cube;
  }

  action () {
    this.scene.animate(this.shape, function(shape: Shape) {
      shape.rotation.x += 0.01;
      shape.rotation.y += 0.01;
    });
  }
}

export default Organism;