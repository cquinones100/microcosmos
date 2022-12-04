import { Graphics, Matrix, MSAA_QUALITY, Renderer, RenderTexture, Sprite } from "pixi.js"
import { Coords } from "./organisms/autotroph";
import Scene from "./scene";

type TextureOrganismProps = {
  shape: Sprite;
  scene: Scene;
  width: number;
  height: number;
} & Coords;

class TextureOrganism {
  static renderTexture: RenderTexture;
  static templateShape: Graphics;
  public static create({ scene, x, y }: { scene: Scene } & Coords) {
    const { app } = scene;

    const templateShape = new Graphics()
      .beginFill(0xffffff)
      .lineStyle({ width: 1, color: 0x333333, alignment: 0 })
      .drawCircle(0, 0, 10);

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
      transform: new Matrix(1, 0, 0, 1, width / 2, height / 2)
    });

    // Required for MSAA, WebGL 2 only
    (app.renderer as Renderer).framebuffer.blit();

    // Discard the original Graphics
    templateShape.destroy(true);

    const shape = new Sprite(renderTexture);

    shape.position.x = x;
    shape.position.y = y;

    return new TextureOrganism({ shape, scene, width, height, x, y });
  }

  shape: Sprite;
  scene: Scene;

  constructor({ shape, scene, x, y }: TextureOrganismProps) {
    this.shape = shape;
    this.scene = scene;
    this.shape.tint = 0xEFA8B1;
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

export default TextureOrganism;
