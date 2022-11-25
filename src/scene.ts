import * as THREE from "three";
import MovementGene from "./genes/movementGene";
import SeeksEnergy from "./genes/seeksEnergy";
import Reproduces from "./genes/reproduces";
import GeneticCode from "./geneticCode";
import NewOrganism, { OrganismProps } from "./newOrganism";
import RealOrganism, { Chemical, RealOrganismProps } from "./realOrganism";
import BounceOnCollisionGene from "./genes/bounceOnCollisionGene";
import Stats from "stats.js";

const BOUNDARY = 5;

class Scene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  boundaries: NewOrganism[];
  organisms: RealOrganism[];
  allObjects: NewOrganism[];

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    this.renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance" });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.boundaries = [];
    this.organisms = [];
    this.allObjects = [];

    document.body.appendChild(this.renderer.domElement);
  }

  draw() {
    const topBoundary = new NewOrganism({
      height: 100,
      width: 0.1,
      depth: 0.25,
      y: BOUNDARY - 1.5,
      scene: this,
      geneticCode: new GeneticCode()
    });

    this.scene.add(topBoundary.shape);
    this.boundaries.push(topBoundary);

    const rightBoundary = new NewOrganism({
      height: 0.1,
      width: 100,
      depth: 0.25,
      x: BOUNDARY,
      scene: this,
      geneticCode: new GeneticCode()
    });

    this.scene.add(rightBoundary.shape);
    this.boundaries.push(rightBoundary);

    const bottomBoundary = new NewOrganism({
      height: 100,
      width: 0.1,
      depth: 0.25,
      y: BOUNDARY * -1 + 1,
      scene: this,
      geneticCode: new GeneticCode()
    });

    this.scene.add(bottomBoundary.shape);
    this.boundaries.push(bottomBoundary);

    const leftBoundary = new NewOrganism({
      height: 0.1,
      width: 100,
      depth: 0.25,
      x: BOUNDARY * -1,
      scene: this,
      geneticCode: new GeneticCode()
    });

    this.scene.add(leftBoundary.shape);
    this.boundaries.push(leftBoundary);

    this.createOrganisms(1);
    this.camera.position.z = 5;
  }

  add(organism: RealOrganism) {
    this.organisms.push(organism);
    this.scene.add(organism.shape);
  }

  animate() {
    const renderer = this.renderer;
    const scene = this;
    const camera = this.camera;
    const stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    function animate() {
      stats.begin();
      scene.organisms.forEach(organism => organism.animate());
      scene.allObjects = [...scene.organisms.map(({ obj }) => obj, ...scene.boundaries)];
      renderer.render(scene.scene, camera);

      console.log("object count: ", scene.allObjects.length);

      stats.end();

      renderer.setAnimationLoop(animate);
    }

    animate();
  }

  createOrganisms(amount: number) {
    let currentAmount = 0;

    while (currentAmount < amount) {
      const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;
      const ifOne = <T>(oneValue: T, noneOneValue: T): T => {
        if (amount === 1) {
          return oneValue;
        } else {
          return noneOneValue;
        }
      }

      const organism = new NewOrganism({
        height: ifOne(0.1, Math.random() * 0.1),
        width: ifOne(0.1, Math.random() * 0.1),
        depth: ifOne(0.1, Math.random() * 0.1),
        scene: this,
        x: ifOne(0, negatableRandom(3)),
        y: ifOne(0, negatableRandom(3)),
        xDirection: negatableRandom(0.01),
        yDirection: negatableRandom(0.01),
        shapeType: ifOne("sphere", ["square", "sphere", "other"][Math.round(Math.random() * 2)] as OrganismProps["shapeType"]),
        speed: ifOne(0.01, Math.random() * 2),
        geneticCode: new GeneticCode([new MovementGene(), new SeeksEnergy(), new BounceOnCollisionGene(), new Reproduces()]),
      });

      const realOrganism = new RealOrganism({
        energySources: [new Chemical()],
        obj: organism,
        geneticCode: organism.geneticCode,
        scene: this,
      })

      this.add(realOrganism);

      currentAmount += 1;
    }
  }

  createOrganism({
    height,
    width,
    depth,
    scene,
    x,
    y,
    xDirection,
    yDirection,
    shapeType,
    speed,
    geneticCode,
    energySources = [],
    color,
  }: OrganismProps & Pick<RealOrganismProps, 'energySources' | 'geneticCode'>) {
    const organism = new NewOrganism({
      height,
      width,
      depth,
      scene: this,
      x,
      y,
      xDirection,
      yDirection,
      shapeType,
      speed,
      geneticCode,
      color,
    });

    const realOrganism = new RealOrganism({
      energySources: energySources,
      obj: organism,
      geneticCode: organism.geneticCode,
      scene: this,
    })

    this.add(realOrganism);
  }
}

export default Scene;
