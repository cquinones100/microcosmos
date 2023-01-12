import { OrganismProps } from "./organism";
import TextureOrganism from "../textureOrganism";
import Organism from "./organism";
import PersuesTarget from "../behavior/persuesTarget";
import DetectsTarget from "../behavior/detectsTarget";
import MovesRandomly from "../behavior/movesRandomly";
import ConsumesOrganisms from "../behavior/consumesOrganisms";
import Reproduction from "../behavior/reproduction";
import Physics from "../utils/physics/physics";

type HeteroTrophProps = {
  texture: TextureOrganism;
}

class HeteroTroph extends Organism {
  public static create({ texture, ...args }: HeteroTrophProps) {
    const organism = new HeteroTroph({ shape: texture });

    const moves = new MovesRandomly(organism)
    const pursuit = new PersuesTarget(organism);
    const detection = new DetectsTarget(organism);
    const consumes = new ConsumesOrganisms(organism);
    const reproduction = new Reproduction(organism);

    organism.behaviors.push(moves);
    organism.behaviors.push(pursuit);
    organism.behaviors.push(detection);
    organism.behaviors.push(consumes);
    organism.behaviors.push(reproduction);

    reproduction.maxInterval = 500;
    organism.shape.shape.zIndex = 1;
    return organism;
  }

  prey: Organism | undefined;

  constructor({ ...args }: OrganismProps) {
    super({ ...args });

    this.defaultColor = 0xEFA8B1;
    this.shape.shape.tint = this.defaultColor;
    this.shape.shape.on("click", () => {
      console.log(this);
    });
  }

  consume(organism: Organism) {
    Physics.scene!.predators.add(this);

    if (organism.dead()) {
      if (!organism.consumed) {
        organism.consumed = true;
        this.setEnergy(this.energy + organism.maxEnergy * 0.5)
        Physics.scene!.container.removeChild(organism.text);
        Physics.scene!.remove(organism);
      }
    } else {
      const energyFromPrey =
        Math.min(this.maxEnergy - this.energy, Math.max(organism.energy, organism.maxEnergy * 0.5));

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

  duplicate(): Organism {
    const { width, height } = this.shape.getDimensions();
    const { scene } = Physics;
    const { x, y } = this.shape.shape.position;

    const texture = TextureOrganism.create();
    const organism = HeteroTroph.create({ texture })

    organism.setPosition({ x: x! - width, y: y! - height })


    scene!.organisms.add(organism);

    return organism;
  }

  die() {
    this.shape.shape.zIndex = 0;
    this.shape.shape.tint = 0x663633; 
  }
}

export default HeteroTroph;
