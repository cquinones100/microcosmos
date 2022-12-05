import { OrganismProps } from "./organism";
import TextureOrganism from "../textureOrganism";
import { Coords } from "./autotroph";
import Organism from "./organism";
import PersuesTarget from "../behavior/persuesTarget";
import DetectsTarget from "../behavior/detectsTarget";
import MovesRandomly from "../behavior/movesRandomly";
import ConsumesOrganisms from "../behavior/consumesOrganisms";

type HeteroTrophProps = {
  texture: TextureOrganism;
}
& Partial<Coords>
& Pick<OrganismProps, "scene" | "generation" | "color">;

class HeteroTroph extends Organism {
  public static create({ texture, ...args }: HeteroTrophProps) {
    const { x, y } = texture.getPosition();

    const organism = new HeteroTroph({ x, y, shape: texture, ...args});

    const moves = new MovesRandomly(organism)
    const pursuit = new PersuesTarget(organism);
    const detection = new DetectsTarget(organism);
    const consumes = new ConsumesOrganisms(organism);

    organism.behaviors.push(moves, pursuit, detection, consumes);

    organism.shape.shape.zIndex = 1;
    return organism;
  }

  prey: Organism | undefined;

  constructor({ x, y, ...args }: OrganismProps) {
    super({ x, y, ...args });

    if (x !== undefined && y !== undefined) {
      this.setPosition({ x, y });
    }
  }

  animate() {
    super.animate();
  }

  consume(organism: Organism) {
    this.scene.predators.add(this);

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
    return this.dead() && !this.consumed;
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
    this.shape.shape.zIndex = 1;
    this.shape.shape.tint = 0x663633; 

    super.die();
  }
}

export default HeteroTroph;
