import { Graphics, Matrix, MSAA_QUALITY, Renderer, RenderTexture, Sprite } from "pixi.js"
import { Coords } from "./organisms/autotroph";
import Scene from "./scene";

const WIDTH = 10;

type TextureOrganismProps = {
  renderTexture: RenderTexture;
  scene: Scene;
  width: number;
  height: number;
} & Partial<Coords>;

class TextureAutotroph {
  static renderTexture: RenderTexture;
  static templateShape: Graphics;

  public static create({ scene, x, y }: { scene: Scene } & Partial<Coords>) {
    const { app } = scene;

    const templateShape = new Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, WIDTH, WIDTH);

    const { width, height } = templateShape;

    // Draw the circle to the RenderTexture
    this.renderTexture ||= RenderTexture.create({
      width,
      height,
      multisample: MSAA_QUALITY.HIGH,
      resolution: window.devicePixelRatio
    });

    const { renderTexture } = this;

    // With the existing renderer, render texture
    // make sure to apply a transform Matrix
    app.renderer.render(templateShape, {
      renderTexture,
      transform: new Matrix(1, 0, 0, 1, 0, 0)
    });

    // Required for MSAA, WebGL 2 only
    (app.renderer as Renderer).framebuffer.blit();

    // Discard the original Graphics
    templateShape.destroy(true);

    return new TextureAutotroph({ scene, width, height, renderTexture, x, y });
  }

  renderTexture: RenderTexture;
  shape: Sprite;
  scene: Scene;

  constructor({ renderTexture, scene, x, y }: TextureOrganismProps) {
    this.shape = new Sprite(renderTexture);
    this.renderTexture = renderTexture;
    this.scene = scene;
    this.shape.position.x = x === undefined ? this.scene.app.screen.width / 2 : x;
    this.shape.position.y = y === undefined ? this.scene.app.screen.height / 2 : y;

    this.shape.position.x -= WIDTH / 2;
    this.shape.position.y -= WIDTH / 2;
    this.scene.container.addChild(this.shape);
  }

  getPosition() {
    return this.shape.position;
  }

  getGlobalPosition() {
    return this.shape.getGlobalPosition();
  }
  getDimensions() {
    return { width: this.shape.width, height: this.shape.height };
  }
}

export default TextureAutotroph;
