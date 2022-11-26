import Gene from "../gene";
import Movement from "../movement";
import RealOrganism from "../realOrganism";

class SeeksEnergy extends Gene {
  animate() {
    this.resolve();
  }

  resolve() {
    const iterator = this.organism.behaviors.values();

    let current = iterator.next().value;

    const isMovement = current instanceof Movement;

    while (current && !(isMovement)) {
      current = iterator.next().value;
    }

    const negatableRandom = (max: number) => Math.round(Math.random()) ? Math.random() * max : Math.random() * max * - 1;

    if (current) {
      if (current.speed === 0) current.speed = Movement.DEFAULT_SPEED;
      if (current.xDirection === 0) current.xDirection = negatableRandom(1);
      if (current.yDirection === 0) current.yDirection = negatableRandom(1);
    }
  }

  increase() {}

  duplicate(newOrganism: RealOrganism): Gene {
    return new SeeksEnergy(newOrganism);
  }

  mutate() {}
}

export default SeeksEnergy;
