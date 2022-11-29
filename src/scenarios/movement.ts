import Movement, { Direction } from "../behavior/movement";
import MovementGene from "../genes/movementGene";
import GeneticCode from "../geneticCode";
import Organism from "../organisms/organism";
import Scene from "../scene";

export const create = (scene: Scene) => {
  const movementGene = (organism: Organism, { xDirection, yDirection }: Partial<Direction>) => {
    const movement = new Movement();

    if (xDirection !== undefined) {
      movement.xDirection = xDirection;
    }

    if (yDirection !== undefined) {
      movement.xDirection = yDirection;
    }

    return new MovementGene(organism, movement);
  }

  const organism = scene.createHeterotroph({ x: 0, y: scene.center.y });
  organism.geneticCode = new GeneticCode([movementGene(organism, { xDirection: 1 })]);

  const secondOrganism = scene.createHeterotroph({
    x: scene.app.screen.width - organism.getDimensions().width,
    y: scene.center.y
  });

  secondOrganism.shape.shape.tint = 0x1ECEE6;
  secondOrganism.geneticCode = new GeneticCode([movementGene(secondOrganism, { xDirection: -1 })]);
};
