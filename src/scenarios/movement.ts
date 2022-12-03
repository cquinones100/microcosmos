import DetectsTarget from "../behavior/detectsTarget";
import MovesRandomly from "../behavior/movesRandomly";
import PersuesTarget from "../behavior/persuesTarget";
import GeneticCode from "../geneticCode";
import Scene from "../scene";
import Physics from "../utils/physics/physics";

export const create = (scene: Scene) => {
  const { width, height } = scene.getDimensions();

  for (let i = 0; i < 100; i++) {
    const secondOrganism = scene.createHeterotroph({
      x: Math.random() * width - 60,
      y: Math.random() * height,
      color: 0x1ECEE6,
    });

    secondOrganism.geneticCode = new GeneticCode([]);
    secondOrganism.scenarioBehaviors.push(new MovesRandomly(secondOrganism));
  }

  for (let i = 0; i < 5; i++) {
    const organism = scene.createHeterotroph({
      ...Physics.randomLocation(),
    });

    const pursuit = new PersuesTarget(organism);
    const detection = new DetectsTarget(organism);
    organism.scenarioBehaviors.push(pursuit, detection);
  }
};
