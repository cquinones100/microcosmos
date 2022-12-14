import { Graphics, Matrix, MSAA_QUALITY, Renderer, RenderTexture, Sprite } from "pixi.js";
import { DEFAULT_ENERGY, IBehavior } from "../behavior";
import { initializeDuplicateBehavior } from "../duplication";
import Organism from "../organisms/organism";
import Physics from "../utils/physics/physics";

class DetectsTarget implements IBehavior {
  organism: Organism;
  radius: number;
  target: Organism | undefined;
  shape: any;
  targets: Set<Organism> = new Set();
  energy: number;

  static showRadius = false;

  public static for(organism: Organism) {
    let detectsTarget =
      organism
        .behaviors
        .find(behavior => behavior instanceof DetectsTarget);

    if (!detectsTarget) {
      detectsTarget = new DetectsTarget(organism);

      organism.behaviors.push(detectsTarget);
    }

    return detectsTarget as DetectsTarget;
  }

  constructor(organism: Organism) {
    this.energy = DEFAULT_ENERGY
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
 
    app.renderer.render(templateShape, {
      renderTexture,
      transform: new Matrix(1, 0, 0, 1, width / 2, height / 2)
    });

    (app.renderer as Renderer).framebuffer.blit();

    // Discard the original Graphics
    templateShape.destroy(true);

    this.shape = new Sprite(renderTexture);

    this.shape.zIndex = 1;
  }

  duplicate(duplicateOrganism: Organism): DetectsTarget {
    const duplicate =
      initializeDuplicateBehavior(this, new DetectsTarget(duplicateOrganism));

    duplicate.radius = this.radius;

    return duplicate;
  }

  mutate() {
    this.radius = Math.min(10, this.radius + Physics.negatableRandom(50))
  }

  call() {
    if (DetectsTarget.showRadius) {
      Physics.scene!.container.addChild(this.shape)
      this.organism.otherShapes.push(this.shape);
    } else {
      Physics.scene!.container.removeChild(this.shape)
    }

    const { x, y } = this.organism.getPosition();
    const { width, height } = this.organism.getDimensions();

    this.shape.position = { x: x - this.radius + width / 2, y: y - this.radius + height / 2 };

    this.targets = new Set();

    Physics.scene!.measure('detection', () => {
      this.shape.position = { x: x - this.radius + width / 2, y: y - this.radius + height / 2 };

      for (let organism of Physics.scene!.organisms) {
        if (organism !== this.organism) {
          const { x: targetX, y: targetY } = organism.getPosition();

          const vector = Physics.Vector.getVector({ x, y, targetX, targetY });

          if (vector.getLengthSquared() < this.radius * this.radius) {
            this.targets.add(organism);
          }
        }
      }
    })
  }
}

export default DetectsTarget;
