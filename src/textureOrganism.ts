import { Graphics, Matrix, MSAA_QUALITY, Renderer, RenderTexture, Sprite } from "pixi.js"
import { Coords } from "./organisms/autotroph";
import Scene from "./scene";
import Texture from "./texture";
import Physics from "./utils/physics/physics";

class TextureOrganism extends Texture {
  static renderTexture: RenderTexture;
  static templateShape: Graphics;

  public static create() {
    const { app } = Physics.scene!;

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

    return new TextureOrganism({ renderTexture });
  }
}

export default TextureOrganism;
