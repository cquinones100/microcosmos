import Scene from "./scene";

class Canvas {
  draw() {
    window.addEventListener("load", () => {
      const scene = new Scene();
      scene.draw();
    }, false);
  }
}

export default Canvas;
