import Boundary from "./boundary";
import Organism from "./organism";
import Scene from "./scene";

class Canvas {
  draw() {
    window.addEventListener("load", () => {
      const scene = new Scene();

      const organism = new Organism("sphere", scene);
      const leftBoundary = new Boundary({
        width: 1,
        height: scene.getHeight(),
        scene: scene,
        positionX: scene.getLeft(),
        positionY: 0
      });

      const rightBoundary = new Boundary({
        width: 1,
        height: scene.getHeight(),
        scene: scene,
        positionX: scene.getRight() - 1,
        positionY: 0
      });

      const topBoundary = new Boundary({
        width: scene.getWidth(),
        height: 1,
        scene: scene,
        positionX: 0,
        positionY: scene.getTop()
      });

      const bottomBoundary = new Boundary({
        width: scene.getWidth(),
        height: 1,
        scene: scene,
        positionX: 0,
        positionY: scene.getBottom()
      });

      organism.action();
    }, false);
  }

}

export default Canvas;
