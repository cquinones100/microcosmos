import Organism from "./organism";
import Scene from "./scene";

class Canvas {
  draw() {
    window.addEventListener("load", () => {
      const scene = new Scene();
      scene.cameraPosition.z = 100;

      const leftBoundary = new Organism({
        shape: "square",
        organismName: "Left Boundary",
        speed: 0,
        width: 1,
        height: this.worldScale(scene.getHeight()),
        scene: scene,
        positionX: this.worldScale(scene.getLeft() + 1),
        positionY: 0
      });

      const rightBoundary = new Organism({
        shape: "square",
        organismName: "Right Boundary",
        speed: 0,
        width: 1,
        height: this.worldScale(scene.getHeight()),
        scene: scene,
        positionX: this.worldScale(scene.getRight() - 1),
        positionY: 0
      });

      const topBoundary = new Organism({
        shape: "square",
        organismName: "Right Boundary",
        speed: 0,
        width: this.worldScale(scene.getWidth()),
        height: 1,
        scene: scene,
        positionX: 0,
        positionY: this.worldScale(scene.getTop())
      });

      const bottomBoundary = new Organism({
        shape: "square",
        organismName: "Right Boundary",
        speed: 0,
        width: this.worldScale(scene.getWidth()),
        height: 1,
        scene: scene,
        positionX: 0,
        positionY: this.worldScale(scene.getBottom())
      });

      scene.addBoundary(leftBoundary);
      scene.addBoundary(rightBoundary);
      scene.addBoundary(topBoundary);
      scene.addBoundary(bottomBoundary);

      scene.createOrganism(20);
      
      if (document) { 
        document.addEventListener('wheel', (event) => {
          scene.setZoom(event.deltaY);
        });
      }
    }, false);
  }

  private worldScale(value: number) {
    return value * 2;
  }
}

export default Canvas;
