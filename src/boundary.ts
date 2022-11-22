import * as THREE from "three";
import Scene from "./scene";

class Boundary {
  width: number;
  height: number;
  scene: Scene;
  positionX: number;
  positionY: number;

  constructor(
    {
      scene,
      width,
      height,
      positionX,
      positionY
    }: {
      scene: Scene,
      width: number,
      height: number,
      positionX: number,
      positionY: number
    }
  ) {
    this.width = width;
    this.height = height;
    this.scene = scene;
    this.positionX = positionX;
    this.positionY = positionY;

    const geometry = new THREE.BoxGeometry(
      this.scene.size(width),
      this.scene.size(height),
      1
    );
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const boundary = new THREE.Mesh(geometry, material);

    boundary.position.setX(positionX);
    boundary.position.setY(positionY);

    this.scene.add(boundary);
  }

}

export default Boundary;
