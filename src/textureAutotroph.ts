import { Graphics, Matrix, MSAA_QUALITY, Renderer, RenderTexture, Sprite } from "pixi.js"
import { Coords } from "./physics/coordinates";
import Texture from "./texture";
import Physics from "./utils/physics/physics";

const WIDTH = 10;

type TextureOrganismProps = {
  renderTexture: RenderTexture;
  width: number;
  height: number;
} & Partial<Coords>;

class TextureAutotroph extends Texture {
  static renderTexture: RenderTexture;
  static templateShape: Graphics;

  public static create() {
    const templateShape = new Graphics()
      .beginFill(0xf1b04c)
      .lineStyle({ width: 1, color: 0xFFFFFF, alignment: 0 })
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
    const { app } = Physics.scene!;

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

    return new TextureAutotroph({ renderTexture });
  }
}

export default TextureAutotroph;
