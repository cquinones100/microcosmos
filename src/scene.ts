import * as THREE from "three";
import Organism, { OrganismShapeName } from "./organism";
import { faker } from '@faker-js/faker';

class Scene {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  cameraPosition: THREE.Vector3;
  boundaries: Organism[];
  organisms: Organism[];
  zoom: number;

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
    this.zoom = 1;

    this.boundaries = [];
    this.organisms = [];
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

  createOrganism(amount: number) {
    let currentAmount = 0;

    while (currentAmount < amount) {
      const index = Math.round(Math.random() * 2);
      const organism = new Organism({
        shape: ['square', 'sphere'][index] as OrganismShapeName,
        scene: this,
        organismName: faker.lorem.slug(),
        speed: Math.random() * 4,
        width: Math.random() * 2,
        height: Math.random() * 2,
        positionX: Math.random() * 200 * Math.round(Math.random()) ? 1 : -1,
        positionY: Math.random() * 200 * Math.round(Math.random()) ? 1 : -1
      });

      this.addBoundary(organism);
      this.organisms.push(organism);
      organism.action();

      currentAmount += 1;
    }
  }

  setZoom(value: number) {
    this.camera.zoom += value;

    this.organisms.forEach(organism => organism.zoom());
  }
}

export default Scene;
