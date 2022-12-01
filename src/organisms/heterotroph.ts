import MovementGene from "../genes/movementGene";
import Reproduces from "../genes/reproduces";
import SeeksEnergy from "../genes/seeksEnergy";
import GeneticCode from "../geneticCode";
import { OrganismProps } from "./organism";
import TextureOrganism from "../textureOrganism";
import WorldObject from "../worldObject";
import { Coords } from "./autotroph";
import Organism from "./organism";
import Movement from "../behavior/movement";

type HeteroTrophProps = {
  texture: TextureOrganism;
}
& Partial<Coords>
& Pick<OrganismProps, "scene" | "generation" | "color">
& Partial<Pick<OrganismProps, "geneticCode">>

class HeteroTroph extends Organism {
  public static create({ texture, geneticCode, ...args }: HeteroTrophProps) {
    const { x, y } = texture.getPosition();

    const organism = new HeteroTroph({ x, y, shape: texture, ...args});

    if (geneticCode) {
      organism.geneticCode = geneticCode;
    } else {
      organism.geneticCode = new GeneticCode([
        new Reproduces(organism),
        new MovementGene(organism),
        new SeeksEnergy(organism),
      ]);
    }

    organism.shape.shape.zIndex = 1;
    return organism;
  }

  prey: Organism | undefined;

  constructor({ x, y, ...args }: OrganismProps) {
    super({ x, y, ...args });

    if (x !== undefined && y !== undefined) {
      this.setPosition({ x, y });
    }

    this.maxEnergy = 10000;
    this.energy = 10000;
  }

  animate() {
    super.animate();
  }

  consume(organism: Organism) {
    this.scene.predators.add(this);
    this.scene.prey.add(organism);

    if (organism.dead()) {
      if (!organism.consumed) {
        organism.consumed = true;
        this.setEnergy(this.energy + organism.maxEnergy * 0.1)
        organism.scene.container.removeChild(organism.text);
        this.scene.remove(organism);
      }
    } else {
      const energyFromPrey = Math.min(this.maxEnergy - this.energy, organism.energy);

      organism.setEnergy(organism.energy - energyFromPrey);
      this.setEnergy(this.energy + energyFromPrey);

      if (organism.energy <= 0) {
        organism.die();
      }
    }
  }

  canBeEatenBy(organism: HeteroTroph) {
    return this.dead();
  }

  onIntersection({ x, y }: Coords, intersectionObject: WorldObject, ignoreIntersection: () => void): void {
    if (intersectionObject instanceof Organism && this.canEat(intersectionObject)) {
      ignoreIntersection();
    } else {
      const movement = this.movement();

      if (movement) {
        const move = () => {
          const { xDirection, yDirection, speed } = movement;
          const { scene } = this;

          const { x, y } = Movement.calculatedCoordinate({
            xDirection: xDirection! * -1,
            yDirection: yDirection! * -1,
            speed,
            scene,
            x: this.getPosition().x,
            y: this.getPosition().y
          });

          const { width, height } = this.getDimensions();

          this.shape.shape.position.x = x + width / 2;
          this.shape.shape.position.y = y + height / 2;
        }

        if (!(intersectionObject instanceof Organism) || this.energy < intersectionObject.energy) {
          move();
        }
      }
    }
  }

  duplicate(): Organism {
    const { width, height } = this.shape.getDimensions();
    const { scene } = this.shape;
    const { x, y } = this.shape.shape.position;

    const texture = TextureOrganism.create({ scene, x: x! - width, y: y! - height });
    const organism = HeteroTroph.create({ texture, scene })

    scene.organisms.add(organism);

    return organism;
  }

  die() {
    this.shape.shape.zIndex = 0;
    this.shape.shape.tint = 0x663633; 

    super.die();
  }
}

export default HeteroTroph;
