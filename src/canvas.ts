import Organism from "./organism";
import Scene from "./scene";

class Canvas {
  draw() {
    window.addEventListener("load", () => {
      const scene = new Scene();

      const organism = new Organism("square", scene);
    }, false);
  }

}

export default Canvas;
