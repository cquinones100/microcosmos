import { Graphics, Matrix, MSAA_QUALITY, Renderer, RenderTexture, Sprite } from "pixi.js";
import { IBehavior } from "../behavior";
import Organism from "../organisms/organism";
import Physics from "../utils/physics/physics";

class DetectsTarget implements IBehavior {
  organism: Organism;
  radius: number;
  target: Organism | undefined;
  shape: any;
  targets: Organism[] = [];

  public static for(organism: Organism) {
    let movement =
      organism.scenarioBehaviors
      .find(behavior => behavior instanceof DetectsTarget) as DetectsTarget;

    if (!movement) {
      movement = new DetectsTarget(organism);

      organism.scenarioBehaviors.push(movement);
    }

    return movement;
  }

  constructor(organism: Organism) {
    this.organism = organism;
    this.radius = 100;
    const { x, y } = this.organism.getPosition();

    const templateShape = new Graphics()
      .lineStyle({ width: 1, color: 0xFFFFFF, alignment: 0 })
      .drawCircle(0, 0, this.radius);

    const { width, height } = templateShape;

    const renderTexture = RenderTexture.create({
      width,
      height,
      multisample: MSAA_QUALITY.HIGH,
      resolution: window.devicePixelRatio
    });

    const { app, container } = Physics.scene!;

    console.log(app, container);
 
    app.renderer.render(templateShape, {
      renderTexture,
      transform: new Matrix(1, 0, 0, 1, width / 2, height / 2)
    });

    (app.renderer as Renderer).framebuffer.blit();

    // Discard the original Graphics
    templateShape.destroy(true);

    this.shape = new Sprite(renderTexture);

    this.shape.zIndex = 1;
    container.addChild(this.shape);

    this.organism.otherShapes.push(this.shape);
  }

  call() {
    const { x, y } = this.organism.getPosition();
    const { width, height } = this.organism.getDimensions();

    this.shape.position = { x: x - this.radius + width / 2, y: y - this.radius + height / 2 };

    this.targets = [];

    for (let organism of Physics.scene!.organisms) {
      if (organism !== this.organism) {
        const { x: targetX, y: targetY } = organism.getPosition();

        const vector = Physics.Vector.getVector({ x, y, targetX, targetY });

        if (vector.getLengthSquared() < this.radius * this.radius) {
          this.targets.push(organism);
        }
      }
    }
  }
}

export default DetectsTarget;
