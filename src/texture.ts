import { RenderTexture, Sprite } from "pixi.js";
import { Coords } from "./physics/coordinates";
import Physics from "./utils/physics/physics";

class Texture {
  shape: Sprite;
  renderTexture: RenderTexture;

  constructor({ renderTexture }: { renderTexture: RenderTexture }) {
    this.shape = new Sprite(renderTexture);
    this.renderTexture = renderTexture;
    const { container } = Physics.scene!;

    container.addChild(this.shape);
  }

  getPosition() {
    const { x, y } = this.shape.position;
    const { width, height } = this.getDimensions();

    return {
      x: x + width / 2,
      y: y + height / 2
    }
  }

  getDimensions() {
    const { width, height } = this.shape;

    return { width, height };
  }

  setPosition({ x, y }: Coords) {
    const { width, height } = this.getDimensions();

    this.shape.position.x = x - width / 2;
    this.shape.position.y = y - height / 2;
  }

  setColor(color: number) {
    this.shape.tint = color;
  }
}

export default Texture;