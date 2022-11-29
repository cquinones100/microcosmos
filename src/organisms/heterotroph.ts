import MovementGene from "../genes/movementGene";
import Reproduces from "../genes/reproduces";
import SeeksEnergy from "../genes/seeksEnergy";
import GeneticCode from "../geneticCode";
import { OrganismProps } from "./organism";
import TextureOrganism from "../textureOrganism";
import WorldObject from "../worldObject";
import { Coords } from "./autotroph";
import Organism from "./organism";

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

  constructor({ x, y, ...args }: OrganismProps) {
    super({ x, y, ...args });

    if (x !== undefined && y !== undefined) {
      this.setPosition({ x, y });
    }
  }

  consume(organism: Organism) {
    this.scene.predators.add(this);
    this.scene.prey.add(organism);

    if (organism.dead()) {
      this.setEnergy(organism.maxEnergy * 0.1)
      this.scene.remove(organism);
    } else {
      const energyFromPrey = Math.min(this.maxEnergy - this.energy, organism.energy);

      organism.setEnergy(organism.energy - energyFromPrey);
      this.setEnergy(energyFromPrey);

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
      const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;
      this.shape.shape.position.x = negatableRandom(x + this.getDimensions().width);
      this.shape.shape.position.x = negatableRandom(y + this.getDimensions().height);
    }
  }

  duplicate(): Organism {
    const { width, height } = this.shape.getDimensions();
    const { renderTexture, scene } = this.shape;
    const { x, y } = this.shape.shape.position;

    const texture = TextureOrganism.create({ scene, x: x! - width, y: y! - height });
    const organism = HeteroTroph.create({ texture, scene })

    scene.organisms.add(organism);

    return organism;
  }

  die() {
    this.shape.shape.zIndex = 0;
    this.shape.shape.tint = 0x663633; 
  }
}

export default HeteroTroph;
