import * as THREE from "three";
import Organism from "./organism";

class Scene {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  cameraPosition: THREE.Vector3;
  boundaries: Organism[];

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(
      window.innerWidth / - 2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / - 2,
      1,
      1000 
    );

    this.camera.zoom = 10;
    this.renderer = new THREE.WebGLRenderer;
    this.renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
    this.cameraPosition = this.camera.position;

    this.boundaries = [];
    document.body.appendChild(this.renderer.domElement);
  }

  add(args: THREE.Object3D<THREE.Event> | THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>) {
    this.scene.add(args)
  }

  size(value: number) {
    return this.camera.zoom * value;
  }

  getLeft() {
    return this.camera.left;
  }

  getRight() {
    return this.camera.right;
  }

  getTop() {
    return this.camera.top;
  }

  getBottom() {
    return this.camera.bottom;
  }

  getHeight() {
    return this.camera.top - this.camera.bottom;
  }

  getWidth() {
    return this.camera.right - this.camera.left;
  }

  animate(shape: Organism, cb: { (shape: Organism, scene: Scene): void; }) {
    const renderer = this.renderer;
    const scene = this;
    const camera = this.camera;

    function animate() {
      requestAnimationFrame(animate);

      cb(shape, scene);

      renderer.render(scene.scene, camera);
    }

    animate();
  }

  setCameraPosition({ z }: { z: number | null }) {
    if (z) {
      this.cameraPosition.z = this.size(z);
    }
  }

  addBoundary(boundary: Organism) {
    this.boundaries.push(boundary);
  }
}

export default Scene;
