import Behavior from "../behavior";
import Movement from "../behavior/movement";
import Reproduction from "../behavior/reproduction";
import Gene from "../gene";
import RealOrganism from "../realOrganism";

class MovementGene extends Gene {
  movement: Movement;

  constructor(organism: RealOrganism, movement?: Movement) {
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
      const increaseOrDecrease = [1,-1][Math.round(Math.random())];
      const magnitude = Math.random() * 2;

      this.movement.speed -= Math.max(this.movement.speed * increaseOrDecrease * magnitude, 0);

      this.movement.speed = Math.max(this.movement.speed, 5);
      this.movement.xDirection = Movement.randomDirectionValue();
      this.movement.yDirection = Movement.randomDirectionValue();

      const iterator = this.organism.behaviors.values();

      let current = iterator.next().value;

      const isBehavior = (current: Behavior) => current instanceof Reproduction;

      while (current && !(isBehavior(current))) {
        current = iterator.next().value;
      }

      if (current) {
        current.interval = current.interval / this.movement.speed;
      }
    }
  }

  duplicate(newOrganism: RealOrganism): MovementGene {
    const gene = new MovementGene(newOrganism);

    gene.movement = this.movement.duplicate() || new Movement();

    return gene;
  }
}

export default MovementGene;
