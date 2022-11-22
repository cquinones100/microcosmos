import * as THREE from "three";
import { Shape } from "./organism";

class Scene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  cube?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  cameraPosition: THREE.Vector3;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.cameraPosition = this.camera.position;
    document.body.appendChild(this.renderer.domElement);
  }

  add(args: THREE.Object3D<THREE.Event> | THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>) {
    this.scene.add(args)
  }

  animate(shape: Shape, cb: { (shape: Shape): void; }) {
    const renderer = this.renderer;
    const scene = this.scene;
    const camera = this.camera;

    function animate() {
      requestAnimationFrame(animate);

      cb(shape);

      renderer.render(scene, camera);
    }

    animate();
  }
}

export default Scene;
