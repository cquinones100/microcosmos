import * as THREE from "three";
import NewOrganism, { OrganismProps } from "./newOrganism";

const BOUNDARY = 5;

class Scene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  boundaries: NewOrganism[];
  organisms: NewOrganism[];

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    this.renderer = new THREE.WebGLRenderer;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.boundaries = [];
    this.organisms = [];

    console.log(window.innerWidth / window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  draw() {
    const topBoundary = new NewOrganism({
      height: 100,
      width: 0.1,
      depth: 0.25,
      y: BOUNDARY - 1.5,
      scene: this
    });

    this.scene.add(topBoundary.shape);
    this.boundaries.push(topBoundary);
    
    const rightBoundary = new NewOrganism({
      height: 0.1,
      width: 100,
      depth: 0.25,
      x: BOUNDARY,
      scene: this
    });

    this.scene.add(rightBoundary.shape);
    this.boundaries.push(rightBoundary);

    const bottomBoundary = new NewOrganism({
      height: 100,
      width: 0.1,
      depth: 0.25,
      y: BOUNDARY * -1 + 1,
      scene: this
    });

    this.scene.add(bottomBoundary.shape);
    this.boundaries.push(bottomBoundary);

    const leftBoundary = new NewOrganism({
      height: 0.1,
      width: 100,
      depth: 0.25,
      x: BOUNDARY * -1,
      scene: this
    });

    this.scene.add(leftBoundary.shape);
    this.boundaries.push(leftBoundary);

    this.createOrganism(150);
    this.camera.position.z = 5;
  }

  add(organism: NewOrganism) {
    this.organisms.push(organism);
    this.scene.add(organism.shape);
  }

  animate() {
    const renderer = this.renderer;
    const scene = this;
    const camera = this.camera;

    function animate() {
      requestAnimationFrame(animate);

      scene.organisms.forEach(organism => organism.animate());

      renderer.render(scene.scene, camera);
    }

    animate();
  }

  createOrganism(amount: number) {
    let currentAmount = 0;

    while (currentAmount < amount) {
      const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

      const organism = new NewOrganism({
        height: Math.random() * 0.1,
        width: Math.random() * 0.1,
        depth: Math.random() * 0.1,
        scene: this,
        x: negatableRandom(3),
        y: negatableRandom(3),
        xDirection: negatableRandom(0.01),
        yDirection: negatableRandom(0.01),
        shapeType: ["square", "sphere", "other"][Math.round(Math.random() * 2)] as OrganismProps["shapeType"],
        speed: Math.random() * 0.6,
      });

      console.log(organism.xDirection, organism.yDirection);

      this.add(organism);

      currentAmount += 1;
    }
  }
}

export default Scene;
