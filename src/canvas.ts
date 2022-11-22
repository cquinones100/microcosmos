import Organism from "./organism";
import Scene from "./scene";

class Canvas {
  draw() {
    window.addEventListener("load", () => {
      const scene = new Scene();
      scene.cameraPosition.z = 100;

      const organism = new Organism({
        shape: "sphere",
        scene: scene,
        organismName: 'E. Coli',
        speed: 5,
        width: 1,
        height: scene.getHeight(),
        positionX: 0,
        positionY: 0
      });

      const leftBoundary = new Organism({
        shape: "square",
        organismName: "Left Boundary",
        speed: 0,
        width: 1,
        height: scene.getHeight(),
        scene: scene,
        positionX: scene.getLeft() + 1,
        positionY: 0
      });

      const rightBoundary = new Organism({
        shape: "square",
        organismName: "Right Boundary",
        speed: 0,
        width: 1,
        height: scene.getHeight(),
        scene: scene,
        positionX: scene.getRight() - 1,
        positionY: 0
      });

      const topBoundary = new Organism({
        shape: "square",
        organismName: "Right Boundary",
        speed: 0,
        width: scene.getWidth(),
        height: 1,
        scene: scene,
        positionX: 0,
        positionY: scene.getTop()
      });

      const bottomBoundary = new Organism({
        shape: "square",
        organismName: "Right Boundary",
        speed: 0,
        width: scene.getWidth(),
        height: 1,
        scene: scene,
        positionX: 0,
        positionY: scene.getBottom()
      });

      scene.addBoundary(leftBoundary);
      scene.addBoundary(rightBoundary);
      scene.addBoundary(topBoundary);
      scene.addBoundary(bottomBoundary);

      organism.action();
    }, false);
  }

}

export default Canvas;
