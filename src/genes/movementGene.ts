import Behavior from "../behavior";
import Movement from "../behavior/movement";
import Reproduction from "../behavior/reproduction";
import Gene from "../gene";
import Organism from "../organisms/organism";

class MovementGene extends Gene {
  movement: Movement;

  constructor(organism: Organism, movement?: Movement) {
    super(organism);

    this.movement = movement || new Movement();
  }

  animate() {
    this.resolve();
  }

  resolve() {
    this.organism.setBehavior(this.movement);
  }

  increase() {}

  mutate() {
    if (this.movement) {
      this.updateSpeed();
    }
  }

  duplicate(newOrganism: Organism): MovementGene {
    const gene = new MovementGene(newOrganism);

    gene.movement = this.movement.duplicate() || new Movement();

    return gene;
  }

  updateSpeed() {
    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    this.movement.defaultSpeed += negatableRandom(1);
    this.movement.defaultSpeed = this.movement.defaultSpeed;
  }
}

export default MovementGene;
