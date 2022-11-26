import Gene from "../gene";
import Movement from "../movement";
import RealOrganism from "../realOrganism";

class MovementGene extends Gene {
  movement: Movement;

  constructor(organism: RealOrganism) {
    super(organism);

    this.movement = new Movement({ obj: this.organism });
  }

  animate() {
    this.resolve();
  }

  resolve() {
    this.organism.setBehavior(this.movement);
  }

  increase() {}

  mutate() {
    console.log("mutating!");

    if (this.movement) {
      const increaseOrDecrease = [1,-1][Math.round(Math.random())];
      const magnitude = Math.random() * 10;

      this.movement.speed -= Math.max(this.movement.speed * increaseOrDecrease * magnitude, 0);
    }
  }

  duplicate(newOrganism: RealOrganism): MovementGene {
    const gene = new MovementGene(newOrganism);

    gene.movement = this.movement.duplicate(newOrganism) || new Movement({ obj: newOrganism });

    return gene;
  }
}

export default MovementGene;