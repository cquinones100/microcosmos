import * as THREE from "three";
import Scene from "./scene";

type OrganismShapeName = "square" | "triangle" | "sphere";

export type OrganismShape = THREE.Mesh<THREE.BoxGeometry | THREE.SphereGeometry, THREE.MeshBasicMaterial>;

class Organism {
  scene: Scene;
  shape: OrganismShape;

  constructor(shape: OrganismShapeName, scene: Scene) {
    this.scene = scene;

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
    const camera = this.scene.camera;
    let xDirection = 0.05;
    let yDirection = 0.02;

    this.scene.animate(this.shape, function (shape: OrganismShape) {
      const frustum = new THREE.Frustum();
      const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(matrix);

      if (!frustum.containsPoint(shape.position)) {
        console.log(shape.position);
        console.log(frustum);
        console.log('Out of view')

        // function bounceLeft() {
        //   shape.position.setX(shape.position.x + direction * -1);
        //   shape.position.setY(shape.position.y + direction);
        // }

        // function bounceDown() {
        //   shape.position.setX(shape.position.x + direction);
        //   shape.position.setY(shape.position.y + direction * -1);
        // }


        xDirection *= -1;
        yDirection *= -1;
      }

      shape.position.setX(shape.position.x + xDirection);
      shape.position.setY(shape.position.y + yDirection);
    });
  }

  private getCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.scene.cameraPosition.z = 5;

    return cube;
  }

  private getSphere() {
    const geometry = new THREE.SphereGeometry(this.scene.size(1), 64, 32);
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometry, material );
    this.scene.add( sphere );

    this.scene.cameraPosition.z = 5;

    return sphere;
  }
}

export default Organism;
