import Behavior, { BehaviorProps } from "../behavior";
import Gene from "../gene";
import Organism from "../organisms/organism";
import RealOrganism from "../realOrganism";

class Reproduction extends Behavior {
  timePassed: number;
  cycles: number;
  interval: number;
  maxCycles: number;

  constructor(args?: BehaviorProps) {
    super(args);
    this.timePassed = 0;
    this.cycles = 0;
    this.interval = 100;
    this.maxCycles = 10;
  }

  call({ organism }: { organism: RealOrganism }) {
    this.timePassed += 1;

    if (this.shouldReproduce(organism)) {
      this.reproduce(organism);

      this.cycles += 1;
    }
  }

  private shouldReproduce(organism: RealOrganism) {
    return this.timePassed % this.interval === 0
      && this.cycles < this.maxCycles
      && organism.energy > organism.maxEnergy * 0.4;
  }

  private reproduce(obj: RealOrganism) {
    if (!obj.geneticCode) return;

    const conditionalMutation = (gene: Gene) => {
      const shouldMutate = Math.random() > 1 - 0.99 ? false : true;

      if (shouldMutate) {
        gene.mutate();
      }
    }

    const organism = obj.duplicate();

    const geneticCode = obj.geneticCode.duplicate(organism);

    organism.energy = obj.energy / 2;
    obj.energy = obj.energy / 2;

    organism.geneticCode = geneticCode;

    organism.geneticCode.forEach(gene => gene.resolve());
    organism.geneticCode.forEach(conditionalMutation)
  }
}

export default Reproduction;
